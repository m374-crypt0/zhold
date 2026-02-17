import { OpenAPIHono } from '@hono/zod-openapi'
import { type KYCData, type CustomerRepository } from '../../repositories/types/customerRepository'
import route from './routes'

type Bindings = {
  customerRepository: CustomerRepository
}

export default new OpenAPIHono<{ Bindings: Bindings }>()
  .openapi(route,
    async (c) => {
      c.req.valid('json')

      const kycData = await c.req.json<KYCData>()

      if (c.env.customerRepository.exists(kycData))
        return c.json({ error: 'This customer is already registered' }, 409)

      const id = c.env.customerRepository.register(kycData)

      return c.json({ ...kycData, id }, 200)
    })
