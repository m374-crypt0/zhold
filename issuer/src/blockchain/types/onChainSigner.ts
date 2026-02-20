export type OnChainSigner = {
  storeCommitment: (commitment: string) => Promise<string>
}

