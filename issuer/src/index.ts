import { Hono } from 'hono'

const app = new Hono()
  .post("/register", (c) => {
    return c.json({
      error: 'missing properties in json object argument',
      requiredProperties: ['firstName', 'lastName', 'email']
    }, 400)
  })

Bun.serve({
  fetch(req) {
    return app.fetch(req)
  },
  port: 3000
})

// NOTE: exported for test suites
export default app;
