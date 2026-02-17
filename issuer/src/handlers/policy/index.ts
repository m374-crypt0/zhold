import { OpenAPIHono } from '@hono/zod-openapi'
import { createMiddleware } from 'hono/factory'

import routes from './routes'
import { type PolicyRepository } from '../../repositories/types/policyRepository'
import { inMemoryPolicyRepository } from '../../repositories/inMemoryPolicyRepository'

type PolicyEnv = {
  Bindings: {
    policyRepository: PolicyRepository
  }
}

const injectPolicyRepository = createMiddleware<PolicyEnv>(async (c, next) => {
  c.env.policyRepository = inMemoryPolicyRepository

  await next()
})

export default new OpenAPIHono<PolicyEnv>()
  .openapi(routes['/policy'](injectPolicyRepository),
    async (c) => {
      return c.json(c.env.policyRepository.listIdentifiers(), 200)
    })
  .openapi(routes['/policy/{id}'](injectPolicyRepository),
    async (c) => {
      return c.json({ error: 'Policy not found' }, 404)
    })
