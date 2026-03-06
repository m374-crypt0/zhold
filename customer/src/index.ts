import { poseidon2HashAsync } from "@zkpassport/poseidon2"

import { Noir, type CompiledCircuit } from "@noir-lang/noir_js"

import { Barretenberg, UltraHonkBackend } from "@aztec/bb.js"

import { cpus } from "node:os"

import type { CommitmentInputForBackend, InputsForBackend, PublicInputsForBackend } from "./types"

import circuit from "../../circuits/target/rwa_eligibility_v1.json"

export default {
  async createCommitment(options: CommitmentInputForBackend) {
    const hash = await poseidon2HashAsync([
      BigInt(options.private_inputs.customer_id),
      BigInt(options.private_inputs.customer_secret),
      BigInt(options.private_inputs.authorized_sender),
      BigInt(options.policy.id),
      BigInt(options.policy.scope.id),
      BigInt(options.policy.scope.parameters.valid_until as string)
    ])

    return hash
  },
  async generateProof(inputs: InputsForBackend) {
    const noir = new Noir(circuit as CompiledCircuit)
    await noir.init()

    const { witness } = await noir.execute(inputs)

    const bb = await Barretenberg.new({ threads: cpus().length })
    const backend = new UltraHonkBackend(circuit.bytecode, bb)
    const { proof } = await backend.generateProof(witness, { verifierTarget: 'evm' })

    await bb.destroy()

    return proof
  },
  async verifyProof(proof: Uint8Array<ArrayBufferLike>, publicInputs: PublicInputsForBackend) {
    const bb = await Barretenberg.new({ threads: cpus().length })
    const backend = new UltraHonkBackend(circuit.bytecode, bb)

    const backendInputs = [
      publicInputs.policy.id,
      publicInputs.policy.scope.id,
      publicInputs.policy.scope.parameters.valid_until as string,
      publicInputs.request.sender,
      publicInputs.request.current_timestamp,
      publicInputs.request.commitment,
    ]

    const result = await backend.verifyProof({ publicInputs: backendInputs, proof }, { verifierTarget: 'evm' })

    await bb.destroy()

    return result
  }
}
