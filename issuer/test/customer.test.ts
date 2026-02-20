import { describe, it, expect, beforeEach } from 'bun:test'
import { testClient } from 'hono/testing'

import compliance from '../src/handlers/customers'
import { clearRepository, inMemoryCustomerRepository } from '../src/repositories/inMemoryCustomerRepository'
import { inMemoryPolicyRepository } from '../src/repositories/inMemoryPolicyRepository'

describe('Customer compliancy querying', () => {
  const client = testClient(compliance, {
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
        }
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
        }
      }
    })

    const response = await res.json() as { error: string }

    expect(res.status).toBe(400)
    expect(response.error).toMatch('This policy does not exist')
  })

  it.each([{
    json: {
      customerId: 0,
      policy: {
        id: 0,
        parameters: {}
      }
    }
  },
  {
    json: {
      customerId: 0,
      policy: {
        id: 0,
        parameters: {
          foo: 'foo'
        }
      }
    }
  }
  ])
    ('should fail to respond if policy parameters do not exist or are missing', async (payload) => {
      createTestCustomerInRepository()

      const res = await client.recordCompliancy.$post(payload)

      const response = await res.json() as { error: string }

      expect(res.status).toBe(400)
      expect(response.error).toMatch('Bad policy parameters')
    })

  it('should respond false for invalid policy parameter value', async () => {
    createTestCustomerInRepository()

    const res = await client.recordCompliancy.$post({
      json: {
        customerId: 0,
        policy: {
          id: 0,
          parameters: {
            validUntil: 'foo'
          }
        }
      }
    })

    const response = await res.json() as { error: string }

    expect(res.status).toBe(400)
    expect(response.error).toMatch('Bad policy parameter values')
  })
})

function createTestCustomerInRepository() {
  inMemoryCustomerRepository.register({
    firstName: 'a',
    lastName: 'a',
    email: 'a@a.a'
  })
}
