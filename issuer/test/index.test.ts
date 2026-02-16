import { describe, it, expect } from 'bun:test'
import { testClient } from 'hono/testing'

import { type KYCData } from '../src/customerRepository'
import { inMemoryCustomerRepository } from '../src/inMemoryCustomerRepository'

import app from '../src/index'

describe('Prospect registration', () => {
  const client = testClient(app, { customerRepository: inMemoryCustomerRepository })

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

  it('should succeed multiple user registrations and return different customer identifiers', async () => {
    await client.register.$post({
      json: {
        firstName: 'Sam',
        lastName: 'Porter',
        email: 'sam.porter@bridges.uca'
      }
    })

    const res = await client.register.$post({
      json: {
        firstName: 'Bridget',
        lastName: 'Strand',
        email: 'bridget.strand@bridges.uca'
      }
    })

    const status = res.status;
    const data = await res.json() as { customerId: number }

    expect(status).toBe(200)
    expect(data.customerId).toBe(1)
  })
})

describe('Customer eligibility record', () => {
  const client = testClient(app)

  it('should fail for unregistered customers', async () => {
    const res = await client.recordEligibility.$post({ json: { customerId: 0 } })

    const status = res.status;
    const data = await res.json() as { error: string }

    expect(status).toBe(404)
    expect(data).toContainKey('error')
    expect(data.error).toBe('This customer is not found')
  })
})
