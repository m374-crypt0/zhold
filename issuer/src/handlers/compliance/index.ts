import { OpenAPIHono } from '@hono/zod-openapi'
import routes from './routes'
import { type PolicyRepository } from '../../repositories/types/policyRepository'
import { type CustomerRepository } from '../../repositories/types/customerRepository'
import { inMemoryPolicyRepository } from '../../repositories/inMemoryPolicyRepository'
import { createMiddleware } from 'hono/factory'
import { inMemoryCustomerRepository } from '../../repositories/inMemoryCustomerRepository'

type ComplianceEnv = {
  Bindings: {
    policyRepository: PolicyRepository,
    customerRepository: CustomerRepository
  }
}

const injectRepositories = createMiddleware<ComplianceEnv>(async (c, next) => {
  c.env.policyRepository = inMemoryPolicyRepository
  c.env.customerRepository = inMemoryCustomerRepository

  await next()
})

export default new OpenAPIHono<ComplianceEnv>()
  .openapi(routes['/compliance'](injectRepositories),
    async (c) => {
      return c.json({ error: 'This customer does not exist' }, 400)
    })
