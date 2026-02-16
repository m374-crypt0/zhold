import { Hono } from 'hono'

export type RegisterInput = {
  firstName: string,
  lastName: string,
  email: string
}

type Customer = RegisterInput & {
  customerId: number
}

const customers: Array<Customer> = []

const app = new Hono()
  .post("/register", async (c) => {
    let args: RegisterInput

    try {
      args = await c.req.json() as RegisterInput
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

    if (customers.some(customer => customer.firstName === args.firstName
      && customer.lastName === args.lastName
      && customer.email === args.email))
      return c.json({ error: 'This customer is already registered' }, 409)

    customers.push({ ...args, customerId: 0 })
    return c.json({ customerId: 0 }, 200)
  })

Bun.serve({
  fetch(req) {
    return app.fetch(req)
  },
  port: 3000
})

// NOTE: exported for test suites
export default app;
