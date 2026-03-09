import customer from "src";

import { LocalOnChainProver } from 'src/blockchain/localOnChainProver';
import type { OnChainProver } from "src/blockchain/types/onChainProver";
import { privateKeyToAccount } from "viem/accounts";

import { createCustomerSecret, getValidProofAndPublicInputs } from "test/utility";

import { describe, expect, it } from "bun:test";

const should = '<integration> should'

describe('Proof submission to blockchain', () => {
  // NOTE: make sure several registration can be done in the same run
  let emailSuffix = 0

  it(`${should} fail to prove on-chain with an unexisting commitment`, async () => {
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

  it(`${should} fail to prove on-chain with an invalid public input set`, async () => {
    const { proof, publicInputs } = await registerThenCreateProofThenRecordCompliancy()

    // NOTE: below is not the authorized_sender
    publicInputs.request.sender = '0xb27542cc8c84c215fa2e4932cfc61245cd1a1514'

    const onChainProver: OnChainProver = new LocalOnChainProver()

    expect(async () => customer.verifyProofOnChain({
      onChainProver,
      proof,
      publicInputs
    })).toThrow('InvalidProof')
  })

  it(`${should} succeeds to prove on-chain with a valid public input set`, async () => {
    const { proof, publicInputs } = await registerThenCreateProofThenRecordCompliancy()
    const onChainProver: OnChainProver = new LocalOnChainProver()

    const result = await customer.verifyProofOnChain({
      onChainProver,
      proof,
      publicInputs
    })

    expect(result).toBeTrue()
  })

  async function registerThenCreateProofThenRecordCompliancy() {
    const privateInputs: Parameters<typeof getValidProofAndPublicInputs>[0] = {
      customer_id: (await registerUserUsingIssuerApi()).toString(),
      customer_secret: createCustomerSecret(),
      authorized_sender: privateKeyToAccount(process.env['TEST_PRIVATE_KEY_03']! as `0x${string}`).address
    }

    const { proof, publicInputs } = await getValidProofAndPublicInputs(privateInputs);
    expect(await customer.verifyProofLocally({ proof, publicInputs })).toBeTrue()

    await recordCompliancyUsingIssuerApi({
      customerId: Number(privateInputs.customer_id),
      policy: {
        id: Number(publicInputs.policy.id),
        scope: {
          id: Number(publicInputs.policy.scope.id),
          parameters: {
            validUntil: Number(publicInputs.policy.scope.parameters.valid_until)
          }
        }
      },
      commitment: `0x${BigInt(publicInputs.request.commitment).toString(16)}`
    })

    return { proof, publicInputs }
  }

  async function registerUserUsingIssuerApi() {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')

    const body = JSON.stringify({
      firstName: 'John',
      lastName: 'Doe',
      // NOTE: Ensuring registration with different yet similar users
      email: `john.doe+${emailSuffix++}@unknown.ufo`
    })

    const request = new Request({
      url: 'http://localhost:3000/prospects/register',
      method: 'POST',
      headers,
      body
    })

    const response = await fetch(request)
    const { id } = await response.json() as { id: number }

    return id
  }

  async function recordCompliancyUsingIssuerApi(body: {
    customerId: number,
    policy: {
      id: number,
      scope: {
        id: number,
        parameters: Record<string, string | number | boolean>
      }
    },
    commitment: string
  }) {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')

    const request = new Request({
      url: 'http://localhost:3000/customers/recordCompliancy',
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    })

    const response = await fetch(request)

    const { result } = await response.json() as { result: boolean }

    return result
  }
})
