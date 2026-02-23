export type OnChainSigner = {
  storeCommitment: (commitment: string) => Promise<string>
  revokeCommitment: (commitment: string) => Promise<string>
}

