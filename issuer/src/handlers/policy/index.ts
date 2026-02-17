import { OpenAPIHono } from '@hono/zod-openapi'
import { type PolicyRepository } from '../../repositories/types/policyRepository'
import route from './routes'

type Bindings = {
  policyRepository: PolicyRepository
}

export default new OpenAPIHono<{ Bindings: Bindings }>()
  .openapi(route,
    async (c) => {
      return c.json(c.env.policyRepository.listIdentifiers(), 200)
    })
