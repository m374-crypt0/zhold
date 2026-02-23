import { OpenAPIHono } from '@hono/zod-openapi'
import { createMiddleware } from 'hono/factory'
import { LocalOnChainSigner } from '../../blockchain/localOnChainSigner'
import type { OnChainSigner } from '../../blockchain/types/onChainSigner'
import routes from './routes'

type IssuerEnv = {
  Bindings: {
    onChainSigner: OnChainSigner,
    env: 'test' | 'prod'
  }
}

const injectRepositories = createMiddleware<IssuerEnv>(async (c, next) => {
  // NOTE: 'test' env set up a testing env (see in customers.test.ts)
  if (c.env.env === 'prod') {
    c.env.onChainSigner = new LocalOnChainSigner()
  }

  await next()
})

export default new OpenAPIHono<IssuerEnv>()
  .openapi(routes['/revokeCommitment'](injectRepositories),
    async (c) => {
      c.req.valid('json')

      return c.json({ error: 'Cannot revoke commitment' }, 500)
    })

