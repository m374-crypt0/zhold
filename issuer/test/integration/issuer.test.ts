import { describe, expect, it } from 'bun:test'
import { testClient } from 'hono/testing'
import { LocalOnChainSigner, type PrivateKey } from 'src/blockchain/localOnChainSigner'
import issuer from 'src/handlers/issuer'

const should = '<integration> should'

describe('Issuer manual revocation', () => {
  it(`${should} fail if the signer is not the issuer`, async () => {
    const wrongLocalChainSigner = new LocalOnChainSigner(process.env['TEST_PRIVATE_KEY_02'] as PrivateKey)
    const client = testClient(issuer, {
      onChainSigner: wrongLocalChainSigner,
      env: 'test'
    })

    const res = await client.revokeCommitment.$post({
      json: {
        commitment: '0x0123456789abcdef'
      }
    })

    expect(res.status).toBe(500)
    expect(await res.json()).toEqual({
      error: 'OwnableUnauthorizedAccount'
    })
  })

  it(`${should} succeed in revoking any commitment if issuer is the signer`, async () => {
    const goodLocalChainSigner = new LocalOnChainSigner(process.env['TEST_PRIVATE_KEY_01'] as PrivateKey)
    const client = testClient(issuer, {
      onChainSigner: goodLocalChainSigner,
      env: 'test'
    })

    const res = await client.revokeCommitment.$post({
      json: {
        commitment: '0x0123456789abcdef'
      }
    })

    expect(res.status).toBe(200)
    expect(await res.json()).toHaveProperty('result')
  })
})
