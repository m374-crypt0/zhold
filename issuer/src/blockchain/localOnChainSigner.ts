import type { OnChainSigner } from "./types/onChainSigner";

export class LocalOnChainSigner implements OnChainSigner {
  revokeCommitment(commitment: string) {
    return Promise.reject('not implemented')
  }

  storeCommitment(commitment: string) {
    return Promise.reject('not implemented')
  }
}
