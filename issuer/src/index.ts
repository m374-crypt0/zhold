import { Hono } from 'hono'

import register from './routes/register'
import recordEligibility from './routes/recordEligibility'

const app = new Hono()
  .route('/register', register)
  .route("/recordEligibility", recordEligibility)

Bun.serve({
  fetch(req) {
    return app.fetch(req)
  },
  port: 3000
})

export default app;
