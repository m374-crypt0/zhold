import { OpenAPIHono } from '@hono/zod-openapi'

import register from './handlers/register'
import policy from './handlers/policy'

const app = new OpenAPIHono()
  .route('/', register)
  .route('/', policy)
  .doc('doc', {
    openapi: '3.0.0',
    info: {
      version: '0.1.0',
      title: 'Issuer API',
      description: 'exposes issuer endpoints for registering, querying policies and record eligibility of customers on-chain'
    }
  })

export default {
  fetch: app.fetch,
  port: 3000
}
