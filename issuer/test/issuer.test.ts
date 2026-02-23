import { describe, expect, it, spyOn } from 'bun:test'
import { testClient } from 'hono/testing'
import issuer from '../src/handlers/issuer'
import { MockedOnChainSigner } from './mock/mockedOnChainSigner'

describe('Issuer manual revocation', () => {
  const succeedingOnChainSigner = new MockedOnChainSigner(true)

  const client = testClient(issuer, {
    onChainSigner: succeedingOnChainSigner,
    env: 'test'
  })

  it('should fail if no commitment is given for revocation', async () => {
    const res = await client.revokeCommitment.$post({
      json: {
        commitment: ''
      }
    })

    expect(res.status).toBe(400)
  })
})
