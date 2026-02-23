import { OpenAPIHono } from '@hono/zod-openapi'
import { createMiddleware } from 'hono/factory'
import { LocalOnChainSigner } from '../../blockchain/localOnChainSigner'
import type { OnChainSigner } from '../../blockchain/types/onChainSigner'
import routes from './routes'

type CustomerEnv = {
  Bindings: {
    onChainSigner: OnChainSigner,
    env: 'test' | 'prod'
  }
}

const injectRepositories = createMiddleware<CustomerEnv>(async (c, next) => {
  // NOTE: 'test' env set up a testing env (see in customers.test.ts)
  if (c.env.env === 'prod') {
    c.env.onChainSigner = new LocalOnChainSigner()
  }

  await next()
})

export default new OpenAPIHono<CustomerEnv>()
  .openapi(routes['/revokeCommitment'](injectRepositories),
    async (c) => {
      return c.json({ error: 'not implemented' }, 400)
    })

