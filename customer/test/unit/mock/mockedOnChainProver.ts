import type { OnChainProver, ProverInputs } from "src/blockchain/types/onChainProver";

export class MockedOnChainProver implements OnChainProver {
  constructor(failureOptions?: { failWith: string }) {
    this.failWith = failureOptions?.failWith
  }

  public prove(_proof: Uint8Array<ArrayBufferLike>, _publicInputs: ProverInputs) {
    if (typeof this.failWith === 'string')
      return Promise.reject(new Error(this.failWith))

    return Promise.resolve(true)
  }

  private failWith: string | undefined
}
