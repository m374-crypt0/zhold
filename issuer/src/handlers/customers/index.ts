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
      const params = c.req.valid('json')

      if (!c.env.customerRepository.exists(params.customerId))
        return c.json({ error: 'This customer does not exist' }, 400)

      const policy = c.env.policyRepository.getFromId(params.policy.id)

      if (policy === undefined)
        return c.json({ error: 'This policy does not exist' }, 400)

      if (!policy.validateParameters(params.policy.parameters))
        return c.json({ error: 'Bad policy parameters' }, 400)

      return c.json({ error: 'Bad policy parameter values' }, 400)

    })
