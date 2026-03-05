import { Barretenberg } from "@aztec/bb.js"

import { bytesToHex } from "viem"
import type { CreateCommitmentOptions, PrivateInputs, Proof, PublicInputs } from "./types"

export default {
  async createCommitment(options: CreateCommitmentOptions) {
    const bb = await Barretenberg.new()

    const hash = (await bb.poseidon2Hash({
      inputs: [
        (await bb.blake2sToField({ data: Buffer.from([options.customerId]) })).field,
        (await bb.blake2sToField({ data: Buffer.from(options.customerSecret.toString()) })).field,
        (await bb.blake2sToField({ data: Buffer.from(options.authorizedSender.toString()) })).field,
        (await bb.blake2sToField({ data: Buffer.from([options.policy.id]) })).field,
        (await bb.blake2sToField({ data: Buffer.from([options.policy.scope.id]) })).field,
        (await bb.blake2sToField({ data: Buffer.from((options.policy.scope.parameters.validUntil as number).toString()) })).field
      ]
    })).hash

    return bytesToHex(hash)
  },
  async generateProof(options: PrivateInputs) { return {} },
  async verifyProof(proof: Proof, publicInputs: PublicInputs) { return false }
}
