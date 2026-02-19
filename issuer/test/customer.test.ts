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
        customerId: '0',
        policy: {
          id: 0,
          parameters: [{
            key: 'validUntil',
            value: '1770297431'
          }]
        }
      }
    })

    const response = await res.json() as { error: string }

    expect(res.status).toBe(400)
    expect(response.error).toMatch('This customer does not exist')
  })

  it('should fail to respond for an unexisting policy', async () => {
    inMemoryCustomerRepository.register({
      firstName: 'a',
      lastName: 'a',
      email: 'a@a.a'
    })

    const res = await client.recordCompliancy.$post({
      json: {
        customerId: '0',
        policy: {
          id: 1,
          parameters: [{
            key: 'foo',
            value: 'bar'
          }
          ]
        }
      }
    })

    const response = await res.json() as { error: string }

    expect(res.status).toBe(400)
    expect(response.error).toMatch('This policy does not exist')
  })

  it.skip('should respond false to eligibility check for holding more than one month', async () => {
  })
})

