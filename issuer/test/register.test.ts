import { describe, it, expect } from 'bun:test'
import { testClient } from 'hono/testing'

import { inMemoryCustomerRepository } from '../src/repositories/inMemoryCustomerRepository'
import { type Customer } from '../src/repositories/types/customerRepository'

import register from '../src/handlers/register'

describe('Prospect registration', () => {
  const client = testClient(register, { customerRepository: inMemoryCustomerRepository })

  it('should succeed user registration and returns a customer identifier', async () => {
    const res = await client.register.$post({
      json: {
        firstName: 'Sam',
        lastName: 'Porter',
        email: 'sam.porter@bridges.uca'
      }
    })

    const status = res.status;
    const data = await res.json() as Customer

    expect(status).toBe(200)
    expect(data.id).toBe(0)
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

  it('should succeed multiple user registrations and return different customer identifiers', async () => {
    await client.register.$post({
      json: {
        firstName: 'Sam',
        lastName: 'Porter',
        email: 'sam.porter@bridges.uca'
      }
    })

    await client.register.$post({
      json: {
        firstName: 'Bridget',
        lastName: 'Strand',
        email: 'bridget.strand@bridges.uca'
      }
    })

    const res = await client.register.$post({
      json: {
        firstName: 'Louise',
        lastName: 'Bridges',
        email: 'louise.bridges@bridges.uca'
      }
    })

    const status = res.status;
    const data = await res.json() as Customer

    expect(status).toBe(200)
    expect(data.id).toBe(2)
  })
})
