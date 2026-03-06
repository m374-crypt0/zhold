import { poseidon2HashAsync } from "@zkpassport/poseidon2"

import type { CreateCommitmentOptions, PrivateInputs, Proof, PublicInputs } from "./types"

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
  async generateProof(options: PrivateInputs) { return {} },
  async verifyProof(proof: Proof, publicInputs: PublicInputs) { return false }
}
