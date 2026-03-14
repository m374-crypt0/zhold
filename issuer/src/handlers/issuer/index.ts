import { OpenAPIHono } from '@hono/zod-openapi'
import { createMiddleware } from 'hono/factory'
import { LocalOnChainCommitmentStore, type PrivateKey } from 'src/blockchain/localOnChainCommitmentStore'
import type { OnChainCommitmentStore } from 'src/blockchain/types/onChainCommitmentStore'
import routes from './routes'

type IssuerEnv = {
  Bindings: {
    onChainCommitmentStore: OnChainCommitmentStore,
    isTesting: boolean | undefined
  }
}

const injectDependencies = createMiddleware<IssuerEnv>(async (c, next) => {
  // NOTE: 'test' env set up a testing env (see in customers.test.ts)
  // As a result those lines won't be covered
  if (!c.env.isTesting) {
    // NOTE: TEST_PRIVATE_KEY_01 is the owner of the on-chain CommitmentStore
    c.env.onChainCommitmentStore = new LocalOnChainCommitmentStore(process.env['TEST_PRIVATE_KEY_01'] as PrivateKey)
  }

  await next()
})

export default new OpenAPIHono<IssuerEnv>()
  .openapi(routes['/revokeCommitment'](injectDependencies),
    async (c) => {
      const params = c.req.valid('json')

      let result: string
      try {
        result = await c.env.onChainCommitmentStore.revokeCommitment(params.commitment)
      } catch (error) {
        const e = error as Error
        return c.json({ error: e.message }, 500)
      }

      return c.json({ result }, 200)
    })

