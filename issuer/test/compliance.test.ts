import { describe, it, expect } from 'bun:test'
import { testClient } from 'hono/testing'

import compliance from '../src/handlers/compliance'
import { inMemoryCustomerRepository } from '../src/repositories/inMemoryCustomerRepository'
import { inMemoryPolicyRepository } from '../src/repositories/inMemoryPolicyRepository'

describe('Customer compliancy querying', () => {
  const client = testClient(compliance, {
    customerRepository: inMemoryCustomerRepository,
    policyRepository: inMemoryPolicyRepository
  })

  it('should fail to respond for an unexisting customer', async () => {
    const res = await client.compliance.$get({ param: { customerId: 0, policyId: 0 } })

    expect(res.status).toBe(400)
    expect(await res.json()).toHaveProperty('error')
  })
})

