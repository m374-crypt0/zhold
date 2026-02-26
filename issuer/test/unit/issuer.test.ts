import { describe, expect, it, spyOn } from 'bun:test'
import { testClient } from 'hono/testing'
import issuer from 'src/handlers/issuer'
import { MockedOnChainSigner } from './mock/mockedOnChainSigner'

const should = '<unit> should'

describe('Issuer manual revocation', () => {
  const succeedingOnChainSigner = new MockedOnChainSigner(true)

  const client = testClient(issuer, {
    onChainSigner: succeedingOnChainSigner,
    isTesting: true
  })

  it(`${should} fail if no commitment is given for revocation`, async () => {
    const res = await client.revokeCommitment.$post({ json: { commitment: '' } })

    expect(res.status).toBe(400)
  })

  it(`${should} fail if on-chain revocation fails`, async () => {
    const failingOnChainSigner = new MockedOnChainSigner(false)
    const client = testClient(issuer, {
      onChainSigner: failingOnChainSigner,
      isTesting: true
    })

    const spy = spyOn(failingOnChainSigner, 'revokeCommitment')

    const res = await client.revokeCommitment.$post({
      json: {
        commitment: '0123456789abcdef'
      }
    })

    const body = await res.json() as { error: string }

    expect(spy).toHaveBeenCalledTimes(1)
    expect(res.status).toBe(500)
    expect(body.error).toBe('Cannot revoke commitment')
  })

  it(`${should} succeed if on-chain revocation succeeds`, async () => {
    const spy = spyOn(succeedingOnChainSigner, 'revokeCommitment')

    const res = await client.revokeCommitment.$post({
      json: {
        commitment: '0123456789abcdef'
      }
    })

    const body = await res.json() as { result: string }

    expect(spy).toHaveBeenCalledTimes(1)
    expect(res.status).toBe(200)
    expect(body.result).toBe('0123456789abcdef')
  })
})
