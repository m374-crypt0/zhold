import { Barretenberg } from "@aztec/bb.js"

import { bytesToHex } from "viem"

export type CreateCommitmentOptions = {
  customerId: number,
  policy: {
    id: number,
    scope: {
      id: number,
      parameters: {
        [name: string]: unknown
      }
    }
  },
  evmAddress: bigint,
  secret: bigint
}

export default {
  async createCommitment(options: CreateCommitmentOptions) {
    const bb = await Barretenberg.new()

    const hash = (await bb.poseidon2Hash({
      inputs: [
        (await bb.blake2sToField({ data: Buffer.from([options.customerId]) })).field,
        (await bb.blake2sToField({ data: Buffer.from(options.secret.toString()) })).field,
        (await bb.blake2sToField({ data: Buffer.from(options.evmAddress.toString()) })).field,
        (await bb.blake2sToField({ data: Buffer.from([options.policy.id]) })).field,
        (await bb.blake2sToField({ data: Buffer.from([options.policy.scope.id]) })).field,
        (await bb.blake2sToField({ data: Buffer.from((options.policy.scope.parameters.validUntil as bigint).toString()) })).field
      ]
    })).hash

    return bytesToHex(hash)
  }
}
