import { describe, it, expect } from 'bun:test'
import { testClient } from 'hono/testing'

import { type RegisterInput } from '../src/index'
import app from '../src/index'

describe('Prospect registration', () => {
  const client = testClient(app)


  it.each([undefined, null])('should fail if arguments are missing', async (args) => {
    const res = await client.register.$post({ json: args })

    const status = res.status;
    const data = await res.json() as { error: string, requiredProperties: [string] }

    expect(status).toBe(400)

    expect(data).toContainKey('error')
    expect(data.error).toBe('missing properties in json object argument')

    expect(data).toContainKey('requiredProperties')
    expect(data.requiredProperties).toContainAllValues(['firstName', 'lastName', 'email'])
  })

  it.each([{ firstName: '', lastName: '', email: '' },
  { firstName: 'john', lastName: '', email: '' },
  { firstName: '', lastName: 'doe', email: '' },
  { firstName: '', lastName: '', email: 'john.doe@unknown.com' },
  ])('should fail if any required property is empty', async (args) => {
    const res = await client.register.$post({ json: args as RegisterInput })

    const status = res.status;
    const data = await res.json() as { error: string }

    expect(status).toBe(400)

    expect(data).toContainKey('error')
    expect(data.error).toBe('firstName, lastName and email must not be empty')
  })

  it('should succeed user registration and returns a customer identifier', async () => {
    const res = await client.register.$post({
      json: {
        firstName: 'Sam',
        lastName: 'Porter',
        email: 'sam.porter@bridges.uca'
      }
    })

    const status = res.status;
    const data = await res.json() as { customerId: number }

    expect(status).toBe(200)
    expect(data.customerId).toBe(0)
  })

  it('should fail at registring the same propsect twice', async () => {
    await client.register.$post({
      json: {
        firstName: 'Sam',
        lastName: 'Porter',
        email: 'sam.porter@bridges.uca'
      }
    })

    const res = await client.register.$post({
      json: {
        firstName: 'Sam',
        lastName: 'Porter',
        email: 'sam.porter@bridges.uca'
      }
    })

    const status = res.status;
    const data = await res.json() as { error: string }

    expect(status).toBe(409)
    expect(data.error).toBe('This customer is already registered')
  })
})
