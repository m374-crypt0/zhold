import { OpenAPIHono } from '@hono/zod-openapi'
import { createMiddleware } from 'hono/factory'

import { createRouteWithMiddleware } from './routes'
import { type PolicyRepository } from '../../repositories/types/policyRepository'
import { inMemoryPolicyRepository } from '../../repositories/inMemoryPolicyRepository'

type PolicyEnv = {
  Bindings: {
    policyRepository: PolicyRepository
  }
}

const route = createRouteWithMiddleware<PolicyEnv>(createMiddleware(async (c, next) => {
  c.env.policyRepository = inMemoryPolicyRepository

  await next()
}))

export default new OpenAPIHono<PolicyEnv>()
  .openapi(route,
    async (c) => {
      return c.json(c.env.policyRepository.listIdentifiers(), 200)
    })
