import { Hono } from 'hono'

import { type KYCData, type CustomerRepository } from './customerRepository'

type RecordEligibilityInput = { customerId: number }

type Bindings = {
  customerRepository: CustomerRepository
}

const app = new Hono<{ Bindings: Bindings }>()
  .post("/register", async (c) => {
    let args: KYCData

    try {
      args = await c.req.json() as KYCData
    } catch (e) {
      return c.json({
        error: 'missing properties in json object argument',
        requiredProperties: ['firstName', 'lastName', 'email']
      }, 400)
    }

    if (!args.firstName || !args.lastName || !args.email) {
      return c.json({
        error: 'firstName, lastName and email must not be empty',
      }, 400)
    }

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
