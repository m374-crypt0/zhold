import { OpenAPIHono } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui'

import register from './handlers/register'
import policy from './handlers/policy'

const app = new OpenAPIHono()
  .route('/', register)
  .route('/', policy)
  .doc('doc', {
    openapi: '3.1.0',
    info: {
      version: '0.1.0',
      title: 'Issuer API',
      description: 'exposes issuer endpoints for registering, querying policies and record eligibility of customers on-chain'
    }
  })
  .get('/ui', swaggerUI({ url: '/doc' }))

export default {
  fetch: app.fetch,
  port: 3000
}
