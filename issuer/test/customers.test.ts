import { beforeEach, describe, expect, it } from 'bun:test'
import { testClient } from 'hono/testing'
import customers from '../src/handlers/customers'
import { clearRepository, inMemoryCustomerRepository } from '../src/repositories/inMemoryCustomerRepository'
import { inMemoryPolicyRepository } from '../src/repositories/inMemoryPolicyRepository'
import { nowFromEpochInSeconds, thirtyDaysLaterFromEpochInSeconds } from '../src/utility/time'

describe('Customers compliancy recording', () => {
  const client = testClient(customers, {
    customerRepository: inMemoryCustomerRepository,
    policyRepository: inMemoryPolicyRepository
  })

  beforeEach(() => clearRepository())

  it('should fail to respond for an unexisting customer', async () => {
    const res = await client.recordCompliancy.$post({
      json: {
        customerId: 0,
        policy: {
          id: 0,
          parameters: {
          }
        },
        commitment: 0
      }
    })

    const response = await res.json() as { error: string }

    expect(res.status).toBe(400)
    expect(response.error).toMatch('This customer does not exist')
  })

  it('should fail to respond for an unexisting policy', async () => {
    createTestCustomerInRepository();

    const res = await client.recordCompliancy.$post({
      json: {
        customerId: 0,
        policy: {
          id: 1,
          parameters: {}
        },
        commitment: 0
      }
    })

    const response = await res.json() as { error: string }

    expect(res.status).toBe(400)
    expect(response.error).toMatch('This policy does not exist')
  })

  it.each(createExistingPolicyParameters([[undefined, undefined], ['foo', 'foo']]))
    ('should fail to respond if policy parameters do not exist or are missing', async (payload) => {
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
    ['validUntil', thirtyDaysLaterFromEpochInSeconds()],
    ['validUntil', nowFromEpochInSeconds()],
  ]))
    ('should respond false for invalid policy parameter value', async (body) => {
      createTestCustomerInRepository()

      const res = await client.recordCompliancy.$post(body)

      const response = await res.json() as { error: string }

      expect(res.status).toBe(400)
      expect(response.error).toMatch('Bad policy parameter values')
    })

  it.each(createExistingPolicyParameters([
    ['validUntil', nowFromEpochInSeconds() + 1],
    ['validUntil', thirtyDaysLaterFromEpochInSeconds() - 1],
  ]))
    ('should respond true for valid policy parameter value', async (body) => {
      createTestCustomerInRepository()

      const res = await client.recordCompliancy.$post(body)

      const response = await res.json() as { result: boolean }

      expect(res.status).toBe(200)
      expect(response.result).toBe(true)
    })
})

function createExistingPolicyParameters(params: [string | undefined, any][]) {
  return params.map(p => {
    const param = {
      json: {
        customerId: 0,
        policy: {
          id: 0,
          parameters: {} as Record<string, any>
        },
        commitment: 0
      }
    }

    if (p[0])
      param.json.policy.parameters[p[0]] = p[1]

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
