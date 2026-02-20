import { OpenAPIHono } from '@hono/zod-openapi'
import { createMiddleware } from 'hono/factory'
import { inMemoryCustomerRepository } from '../../repositories/inMemoryCustomerRepository'
import { inMemoryPolicyRepository } from '../../repositories/inMemoryPolicyRepository'
import type { CustomerRepository } from '../../repositories/types/customerRepository'
import type { PolicyRepository } from '../../repositories/types/policyRepository'
import routes from './routes'

type CustomerEnv = {
  Bindings: {
    customerRepository: CustomerRepository,
    policyRepository: PolicyRepository
  }
}

const injectRepositories = createMiddleware<CustomerEnv>(async (c, next) => {
  c.env.customerRepository = inMemoryCustomerRepository
  c.env.policyRepository = inMemoryPolicyRepository

  await next()
})

export default new OpenAPIHono<CustomerEnv>()
  .openapi(routes['/recordCompliancy'](injectRepositories),
    async (c) => {
      const { customerId, policy } = c.req.valid('json')

      if (!c.env.customerRepository.exists(customerId))
        return c.json({ error: 'This customer does not exist' }, 400)

      if (c.env.policyRepository.getFromId(policy.id) === undefined)
        return c.json({ error: 'This policy does not exist' }, 400)

      return c.json({ error: 'Bad policy parameters' }, 400)
    })
