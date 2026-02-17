import { Hono } from 'hono'

const app = new Hono()
  .post("/recordEligibility", async (c) => {
    return c.json({ error: 'This customer is not found' }, 404)
  })

export default app;
