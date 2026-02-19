import { OpenAPIHono } from '@hono/zod-openapi'
import routes from './routes'
import { createMiddleware } from 'hono/factory'
import type { CustomerRepository } from '../../repositories/types/customerRepository'
import { inMemoryCustomerRepository } from '../../repositories/inMemoryCustomerRepository'

type ComplianceEnv = {
  Bindings: {
    customerRepository: CustomerRepository
  }
}

const injectRepositories = createMiddleware<ComplianceEnv>(async (c, next) => {
  c.env.customerRepository = inMemoryCustomerRepository

  await next()
})

export default new OpenAPIHono<ComplianceEnv>()
  .openapi(routes['/compliance'](injectRepositories),
    async (c) => {
      const { customerId } = c.req.valid('query')

      if (!c.env.customerRepository.exists(Number.parseInt(customerId)))
        return c.json({ error: 'This customer does not exist' }, 400)

      return c.json({ error: 'This policy does not exist' }, 400)

    })
