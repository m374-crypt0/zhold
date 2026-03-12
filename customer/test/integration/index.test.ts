import customer from "src";

import { LocalOnChainProver } from 'src/blockchain/localOnChainProver';
import type { OnChainProver } from "src/blockchain/types/onChainProver";

import { privateKeyToAccount } from "viem/accounts";

import { createCustomerSecret, getTestingCustomerId, getTestingPolicy, getValidProofForTesting } from "test/utility";

import { beforeAll, describe, expect, it } from "bun:test";
import type { PolicyInputs, PrivateInputs, PublicInputs } from "src/types";

const should = '<integration> should'

describe('Proof submission to blockchain', () => {
  const createCommitment = async (policy: PolicyInputs) =>
    `0x${(await customer.createCommitment({ policy, private_inputs: privateInputs })).toString(16)}`

  // NOTE: make sure several registration can be done in the same run
  let emailSuffix = 0

  let sender: `0x${string}`
  let privateInputs: PrivateInputs

  beforeAll(() => {
    sender = privateKeyToAccount(process.env['TEST_PRIVATE_KEY_03'] as `0x${string}`).address
    privateInputs = {
      authorized_sender: sender,
      customer_id: getTestingCustomerId(),
      customer_secret: createCustomerSecret()
    }
  })

  it.only(`${should} fail to prove on-chain with an expired policy`, async () => {
    // NOTE: testing policy parameter is set to 0, definitely expired
    const policy = getTestingPolicy()

    // NOTE: the commitment is correct but not stored on-chain
    const commitment = await createCommitment(policy)

    const publicInputs: PublicInputs = {
      policy,
      request: {
        sender,
        commitment
      }
    }

    const proof = await getValidProofForTesting({ privateInputs, publicInputs });

    expect(await customer.verifyProofLocally({ proof, publicInputs })).toBeTrue()

    const onChainProver: OnChainProver = new LocalOnChainProver()

    expect(async () => customer.verifyProofOnChain({
      onChainProver,
      proof,
      publicInputs
    })).toThrow('ValidityExpired')
  })

  it.only(`${should} fail to prove on-chain with an unexisting commitment`, async () => {
    // NOTE: ensures this policy parameter is high enough to not fail in the Prover smart contract
    const policy = getTestingPolicy()
    policy.scope.parameters.valid_until = Number.MAX_SAFE_INTEGER

    // NOTE: the commitment is correct but not stored on-chain
    const commitment = await createCommitment(policy)

    const publicInputs: PublicInputs = {
      policy,
      request: {
        sender,
        commitment
      }
    }

    const proof = await getValidProofForTesting({ privateInputs, publicInputs });

    expect(await customer.verifyProofLocally({ proof, publicInputs })).toBeTrue()

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
    const privateInputs: Parameters<typeof getValidProofForTesting>[0] = {
      customer_id: (await registerUserUsingIssuerApi()).toString(),
      customer_secret: createCustomerSecret(),
      authorized_sender: privateKeyToAccount(process.env['TEST_PRIVATE_KEY_03']! as `0x${string}`).address
    }

    const { proof, publicInputs } = await getValidProofForTesting(privateInputs);
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
