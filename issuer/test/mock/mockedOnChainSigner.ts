import type { OnChainSigner } from "../../src/blockchain/types/onChainSigner";

export class MockedOnChainSigner implements OnChainSigner {
  constructor(mustSucceed: boolean) {
    this.mustSucceed = mustSucceed
  }

  public revokeCommitment(commitment: string) {
    if (this.mustSucceed)
      return Promise.resolve(commitment)

    return Promise.reject(new Error('Cannot revoke commitment'))
  }

  public storeCommitment(commitment: string) {
    if (this.mustSucceed)
      return Promise.resolve(commitment)

    return Promise.reject(new Error('Cannot store commitment'))
  }

  private mustSucceed: boolean
}
