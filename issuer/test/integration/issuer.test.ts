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
    expect(true, 'test not implemented').toBe(false)
  })
})
