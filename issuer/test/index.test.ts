import { describe, test, expect } from 'bun:test'
import { testClient } from 'hono/testing'

import app from '../src/index'

describe('Prospect registration', () => {
  const client = testClient(app)

  test.each([
    undefined,
    {},
    { firstName: '' },
    { lastName: '' },
    { email: '' },
    {
      firstName: '',
      lastName: ''
    },
    {
      firstName: '',
      email: ''
    },
    {
      lastName: '',
      email: ''
    },
  ])
    ('should fail if arguments are missing', async (args) => {
      const res = await client.register.$post(args)

      const status = res.status;
      const data = await res.json()

      expect(status).toBe(400)

      expect(data).toContainKey('error')
      expect(data.error).toBe('missing properties in json object argument')

      expect(data).toContainKey('requiredProperties')
      expect(data.requiredProperties).toContainAllValues(['firstName', 'lastName', 'email'])
    })
})
