import { Hono } from 'hono'

export type RegisterInput = {
  firstName: string,
  lastName: string,
  email: string
}

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
