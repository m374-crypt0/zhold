import * as z from 'zod'

import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'

const kycDataSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.email()
})

import { type KYCData, type CustomerRepository } from './customerRepository'

type Bindings = {
  customerRepository: CustomerRepository
}

type RecordEligibilityInput = { customerId: number }

const app = new Hono<{ Bindings: Bindings }>()
  .post("/register",
    zValidator('json', kycDataSchema),
    async (c) => {
      const args = await c.req.json() as KYCData

      if (c.env.customerRepository.exists(args))
        return c.json({ error: 'This customer is already registered' }, 409)

      const customerId = c.env.customerRepository.register(args)

      return c.json({ customerId }, 200)
    })
  .post("/recordEligibility", async (c) => {
    let args: RecordEligibilityInput

    try {
      args = await c.req.json() as RecordEligibilityInput
    } catch (e) {
      return c.json({ error: 'missing properties in json object argument', requiredProperties: ['customerId'] }, 400)
    }

    return c.json({ error: 'This customer is not found' }, 404)
  })

Bun.serve({
  fetch(req) {
    return app.fetch(req)
  },
  port: 3000
})

export default app;
