import { describe, expect, it } from 'bun:test'
import { testClient } from 'hono/testing'
import { LocalOnChainSigner, type PrivateKey } from 'src/blockchain/localOnChainSigner'
import customers from 'src/handlers/customers'
import { inMemoryCustomerRepository } from 'src/repositories/inMemoryCustomerRepository'
import { inMemoryPolicyRepository } from 'src/repositories/inMemoryPolicyRepository'
import { thirtyDaysLaterFromEpochInSeconds } from 'src/utility/time'

const should = '<integration> should'

describe('Customer compliancy recording', () => {
  it(`${should} fail if the signer is not the issuer`, async () => {
    const wrongLocalChainSigner = new LocalOnChainSigner(process.env['TEST_PRIVATE_KEY_02'] as PrivateKey)
    const client = testClient(customers, {
      customerRepository: inMemoryCustomerRepository,
      policyRepository: inMemoryPolicyRepository,
      onChainSigner: wrongLocalChainSigner,
      env: 'test'
    })

    createTestCustomerInRepository()

    const res = await client.recordCompliancy.$post({
      json: {
        customerId: 0,
        policy: {
          id: 0,
          parameters: {
            validUntil: thirtyDaysLaterFromEpochInSeconds() - 1
          }
        },
        commitment: '0x0123456789abcdef'
      }
    })

    expect(res.status).toBe(500)
    expect(await res.json()).toEqual({
      error: 'OwnableUnauthorizedAccount'
    })
  })
})

function createTestCustomerInRepository() {
  inMemoryCustomerRepository.register({
    firstName: 'a',
    lastName: 'a',
    email: 'a@a.a'
  })
}
