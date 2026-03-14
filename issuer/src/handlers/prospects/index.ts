import { OpenAPIHono } from '@hono/zod-openapi'
import { createMiddleware } from 'hono/factory'
import { inMemoryCustomerRepository } from 'src/repositories/inMemoryCustomerRepository'
import { type CustomerRepository, type KYCData } from 'src/repositories/types/customerRepository'
import routes from './routes'

type RegisterEnv = {
  Bindings: {
    customerRepository: CustomerRepository
  }
}

const injectDependencies = createMiddleware<RegisterEnv>(async (c, next) => {
  c.env.customerRepository = inMemoryCustomerRepository

  await next()
})

export default new OpenAPIHono<RegisterEnv>()
  .openapi(routes['/register'](injectDependencies),
    async (c) => {
      c.req.valid('json')

      const kycData = await c.req.json<KYCData>()

      if (c.env.customerRepository.isAlreadyRegistered(kycData))
        return c.json({ error: 'This customer is already registered' }, 409)

      const id = c.env.customerRepository.register(kycData)

      return c.json({ ...kycData, id }, 200)
    })
