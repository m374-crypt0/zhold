import { describe, it, expect } from 'bun:test'
import { testClient } from 'hono/testing'

import app from '../src/index'

describe('Prospect registration', () => {
  const client = testClient(app)

  it('should fail if arguments are missing', async () => {
    const res = await client.register.$post()

    const status = res.status;
    const data = await res.json()

    expect(status).toBe(400)

    expect(data).toContainKey('error')
    expect(data.error).toBe('missing properties in json object argument')

    expect(data).toContainKey('requiredProperties')
    expect(data.requiredProperties).toContainAllValues(['firstName', 'lastName', 'email'])
  })
})
