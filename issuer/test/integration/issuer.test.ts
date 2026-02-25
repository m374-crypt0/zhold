import { describe, expect, it } from 'bun:test'
import { testClient } from 'hono/testing'
import { LocalOnChainSigner } from 'src/blockchain/localOnChainSigner'
import issuer from 'src/handlers/issuer'

describe('Issuer manual revocation', () => {
  const localChainSigner = new LocalOnChainSigner

  const client = testClient(issuer, {
    onChainSigner: localChainSigner,
    env: 'prod'
  })

  it('should fail if the signer is not the issuer', async () => {
    const res = await client.revokeCommitment.$post({
      json: {
        commitment: '0x0123456789abcdef'
      }
    })

    expect(res.status).toBe(500)
    expect(await res.json()).toEqual({
      error: 'Failed to revoke commitment'
    })
  })
})
