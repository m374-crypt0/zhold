import { OpenAPIHono } from '@hono/zod-openapi'
import { createMiddleware } from 'hono/factory'
import { LocalOnChainSigner } from 'src/blockchain/localOnChainSigner'
import type { OnChainSigner } from 'src/blockchain/types/onChainSigner'
import routes from './routes'

type IssuerEnv = {
  Bindings: {
    onChainSigner: OnChainSigner,
    env: 'test' | 'prod'
  }
}

const injectRepositories = createMiddleware<IssuerEnv>(async (c, next) => {
  // NOTE: 'test' env set up a testing env (see in customers.test.ts)
  // As a result those lines won't be covered
  if (c.env.env === 'prod') {
    c.env.onChainSigner = new LocalOnChainSigner()
  }

  await next()
})

export default new OpenAPIHono<IssuerEnv>()
  .openapi(routes['/revokeCommitment'](injectRepositories),
    async (c) => {
      const params = c.req.valid('json')

      try {
        await c.env.onChainSigner.revokeCommitment(params.commitment)
      } catch (error) {
        const e = error as Error
        return c.json({ error: e.message }, 500)
      }

      return c.json({ result: true }, 200)
    })

