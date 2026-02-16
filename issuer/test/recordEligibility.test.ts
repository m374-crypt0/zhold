import { describe, it, expect } from 'bun:test'
import { testClient } from 'hono/testing'

import recordEligibility from '../src/routes/recordEligibility'

describe('Customer eligibility record', () => {
  const client = testClient(recordEligibility)

  it('should fail for unregistered customers', async () => {
    const res = await client.recordEligibility.$post({ json: { customerId: 0 } })

    const status = res.status;
    const data = await res.json() as { error: string }

    expect(status).toBe(404)
    expect(data).toContainKey('error')
    expect(data.error).toBe('This customer is not found')
  })
})

