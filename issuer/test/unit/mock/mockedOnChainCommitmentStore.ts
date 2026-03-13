import type { OnChainCommitmentStore } from "src/blockchain/types/onChainCommitmentStore";

export class MockedOnChainCommitmentStore implements OnChainCommitmentStore {
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

  async timestamp() {
    return Promise.resolve(0)
  }

  private mustSucceed: boolean
}
