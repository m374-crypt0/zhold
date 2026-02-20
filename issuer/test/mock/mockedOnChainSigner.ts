import type { OnChainSigner } from "../../src/blockchain/types/onChainSigner";

export class MockedOnChainSigner implements OnChainSigner {
  constructor(mustSucceed: boolean) {
    this.mustSucceed = mustSucceed
  }

  public storeCommitment(commitment: string) {
    if (this.mustSucceed)
      return Promise.resolve(commitment)

    return Promise.reject('Error: cannot store commitment')
  }

  private mustSucceed: boolean
}
