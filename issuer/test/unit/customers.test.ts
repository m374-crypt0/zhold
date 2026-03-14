import { beforeEach, describe, expect, it, spyOn } from 'bun:test'
import { testClient } from 'hono/testing'
import customers from 'src/handlers/customers'
import { clearRepository, inMemoryCustomerRepository } from 'src/repositories/inMemoryCustomerRepository'
import { inMemoryPolicyRepository, MAX_VALIDITY_TIME } from 'src/repositories/inMemoryPolicyRepository'
import { MockedOnChainCommitmentStore } from './mock/mockedOnChainCommitmentStore'

const should = '<unit> should'

const ZERO_COMMITMENT = '0x0000000000000000000000000000000000000000000000000000000000000000'

describe('Customers compliancy recording', async () => {
  const succeedingOnChainCommitmentStore = new MockedOnChainCommitmentStore(true)

  const client = testClient(customers, {
    customerRepository: inMemoryCustomerRepository,
    policyRepository: inMemoryPolicyRepository,
    onChainCommitmentStore: succeedingOnChainCommitmentStore,
    isTesting: true
  })

  beforeEach(() => clearRepository())

  it(`${should} fail to respond for an unexisting customer`, async () => {
    const res = await client.recordCompliancy.$post({
      json: {
        customerId: 0,
        policy: {
          id: 0,
          scope: {
            id: 0,
            parameters: {}
          }
        },
        commitment: ZERO_COMMITMENT
      }
    })

    const response = await res.json() as { error: string }

    expect(res.status).toBe(400)
    expect(response.error).toMatch('This customer does not exist')
  })

  it(`${should} fail to respond for an unexisting policy`, async () => {
    createTestCustomerInRepository();

    const res = await client.recordCompliancy.$post({
      json: {
        customerId: 0,
        policy: {
          id: 1,
          scope: {
            id: 0,
            parameters: {}
          }
        },
        commitment: ZERO_COMMITMENT
      }
    })

    const response = await res.json() as { error: string }

    expect(res.status).toBe(400)
    expect(response.error).toMatch('This policy does not exist')
  })

  it.each(createExistingPolicyParameters([[undefined, undefined], ['foo', 'foo']]))
    (`${should} fail to respond if policy parameters do not exist or are missing`, async (payload) => {
      createTestCustomerInRepository()

      const res = await client.recordCompliancy.$post(payload)

      const response = await res.json() as { error: string }

      expect(res.status).toBe(400)
      expect(response.error).toMatch('Bad policy parameters')
    })

  it.each(createExistingPolicyParameters([
    ['validUntil', 'foo'],
    ['validUntil', 0],
    ['validUntil', null],
    ['validUntil', -3],
    ['validUntil', (await succeedingOnChainCommitmentStore.timestamp()) + MAX_VALIDITY_TIME + 1],
    ['validUntil', await succeedingOnChainCommitmentStore.timestamp()],
  ]))
    (`${should} respond false for invalid policy parameter value`, async (body) => {
      createTestCustomerInRepository()

      const res = await client.recordCompliancy.$post(body)

      const response = await res.json() as { error: string }

      expect(res.status).toBe(400)
      expect(response.error).toMatch('Bad policy parameter values')
    })

  it.each(createExistingPolicyParameters([
    ['validUntil', (await succeedingOnChainCommitmentStore.timestamp()) + 1],
    ['validUntil', (await succeedingOnChainCommitmentStore.timestamp()) + MAX_VALIDITY_TIME],
  ]))
    (`${should} respond true for valid policy parameter value`, async (body) => {
      createTestCustomerInRepository()

      const res = await client.recordCompliancy.$post(body)

      const response = await res.json() as { result: string }

      expect(res.status).toBe(200)
      expect(response.result).not.toBeEmpty()
    })

  it(`${should} fail if on-chain signer fails to store the commitment`, async () => {
    const failingOnChainCommitmentStore = new MockedOnChainCommitmentStore(false)

    const client = testClient(customers, {
      onChainCommitmentStore: failingOnChainCommitmentStore,
      customerRepository: inMemoryCustomerRepository,
      policyRepository: inMemoryPolicyRepository,
      isTesting: true
    })

    createTestCustomerInRepository()

    const body = createExistingPolicyParameters([['validUntil', (await failingOnChainCommitmentStore.timestamp()) + MAX_VALIDITY_TIME]])[0]!

    const spy = spyOn(failingOnChainCommitmentStore, 'storeCommitment')

    const res = await client.recordCompliancy.$post(body)
    const json = await res.json() as { error: string }

    expect(spy).toHaveBeenCalledTimes(1)
    expect(res.status).toBe(500)
    expect(json.error, 'Cannot store commitment')
  })
})

function createExistingPolicyParameters(params: [string | undefined, any][]) {
  return params.map(p => {
    const param = {
      json: {
        customerId: 0,
        policy: {
          id: 0,
          scope: {
            id: 0,
            parameters: {} as Record<string, any>
          }
        },
        commitment: ZERO_COMMITMENT
      }
    }

    if (p[0])
      param.json.policy.scope.parameters[p[0]] = p[1]

    return param
  })
}

function createTestCustomerInRepository() {
  inMemoryCustomerRepository.register({
    firstName: 'a',
    lastName: 'a',
    email: 'a@a.a'
  })
}
