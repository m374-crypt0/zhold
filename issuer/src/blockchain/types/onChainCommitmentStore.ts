export type OnChainCommitmentStore = {
  storeCommitment: (commitment: string) => Promise<string>
  revokeCommitment: (commitment: string) => Promise<string>
}

