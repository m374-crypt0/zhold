import { describe, it, expect } from 'bun:test'
import { testClient } from 'hono/testing'
import { inMemoryPolicyRepository } from '../src/repositories/inMemoryPolicyRepository'
import policy from '../src/handlers/policy'

describe('Policy querying', () => {
  const client = testClient(policy, { policyRepository: inMemoryPolicyRepository })

  it('should return a list of policy identifiers', async () => {
    const res = await client.policy.$get()

    expect(await res.json()).toEqual([0])
  })
})
