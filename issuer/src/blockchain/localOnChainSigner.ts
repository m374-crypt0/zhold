import type { OnChainSigner } from "./types/onChainSigner";

export class LocalOnChainSigner implements OnChainSigner {
  storeCommitment(commitment: string) {
    return Promise.reject('not implemented')
  }
}
