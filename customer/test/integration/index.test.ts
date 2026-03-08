import customer from "src";

import { getValidProofAndPublicInputs } from "test/utility";

import { describe, expect, it } from "bun:test";
import type { OnChainProver } from "src/blockchain/types/onChainProver";
import { LocalOnChainProver } from 'src/blockchain/localOnChainProver'

const should = '<integration> should'

describe('Proof submission to blockchain', () => {
  it(`${should} fail to prove on-chain with an invalid commitment`, async () => {
    const { proof, publicInputs } = await getValidProofAndPublicInputs();
    expect(await customer.verifyProofLocally({ proof, publicInputs })).toBeTrue()

    publicInputs.request.commitment = '42'
    const onChainProver: OnChainProver = new LocalOnChainProver()

    expect(async () => customer.verifyProofOnChain({
      onChainProver,
      proof,
      publicInputs
    })).toThrow('InvalidCommitment')
  })
})

