import { OpenAPIHono } from '@hono/zod-openapi'
import { type KYCData, type CustomerRepository } from '../../repositories/types/customerRepository'
import { createRouteWithMiddleware } from './routes'
import { inMemoryCustomerRepository } from '../../repositories/inMemoryCustomerRepository'

type RegisterEnv = {
  Bindings: {
    customerRepository: CustomerRepository
  }
}

const route = createRouteWithMiddleware<RegisterEnv>(async (c, next) => {
  c.env.customerRepository = inMemoryCustomerRepository

  await next()
})

export default new OpenAPIHono<RegisterEnv>()
  .openapi(route,
    async (c) => {
      c.req.valid('json')

      const kycData = await c.req.json<KYCData>()

      if (c.env.customerRepository.isAlreadyRegistered(kycData))
        return c.json({ error: 'This customer is already registered' }, 409)

      const id = c.env.customerRepository.register(kycData)

      return c.json({ ...kycData, id }, 200)
    })
