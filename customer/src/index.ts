import { poseidon2HashAsync } from "@zkpassport/poseidon2"

import { Noir, type CompiledCircuit } from "@noir-lang/noir_js"

import { Barretenberg, UltraHonkBackend } from "@aztec/bb.js"

import { cpus } from "node:os"

import type { CreateCommitmentOptions, Inputs, PublicInputs } from "./types"

import circuit from "../../circuits/target/rwa_eligibility_v1.json"

export default {
  async createCommitment(options: CreateCommitmentOptions) {
    const hash = await poseidon2HashAsync([
      BigInt(options.customerId),
      options.customerSecret,
      options.authorizedSender,
      BigInt(options.policy.id),
      BigInt(options.policy.scope.id),
      BigInt(options.policy.scope.parameters.validUntil as number)
    ])

    return hash
  },
  async generateProof(inputs: Inputs) {
    const noir = new Noir(circuit as CompiledCircuit)
    await noir.init()

    const { witness } = await noir.execute({
      policy: {
        id: inputs.policy.id,
        scope: {
          id: inputs.policy.scope.id,
          parameters: {
            valid_until: inputs.policy.scope.parameters.validUntil as number
          }
        }
      },
      private_inputs: {
        customer_id: inputs.customerId,
        customer_secret: inputs.customerSecret.toString(),
        authorized_sender: inputs.authorizedSender.toString()
      },
      request: {
        sender: inputs.sender.toString(),
        current_timestamp: inputs.currentTimestamp,
        commitment: inputs.commitment.toString()
      }
    })

    const bb = await Barretenberg.new({ threads: cpus().length })
    const backend = new UltraHonkBackend(circuit.bytecode, bb)
    const { proof } = await backend.generateProof(witness, { verifierTarget: 'evm' })

    await bb.destroy()

    return proof
  },
  async verifyProof(proof: Uint8Array<ArrayBufferLike>, publicInputs: PublicInputs) {
    const bb = await Barretenberg.new({
      threads: cpus().length,
      // logger: (msg) => console.error(`>>> bb log: ${msg}`)
    })
    const backend = new UltraHonkBackend(circuit.bytecode, bb)

    const backendInputs = [
      publicInputs.policy.id.toString(),
      publicInputs.policy.scope.id.toString(),
      (publicInputs.policy.scope.parameters.validUntil as number).toString(),
      publicInputs.sender.toString(),
      publicInputs.currentTimestamp.toString(),
      publicInputs.commitment.toString(),
    ]

    const result = await backend.verifyProof({ publicInputs: backendInputs, proof }, { verifierTarget: 'evm' })

    await bb.destroy()

    return result
  }
}
