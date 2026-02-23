import { swaggerUI } from '@hono/swagger-ui'
import { OpenAPIHono } from '@hono/zod-openapi'

import customers from './handlers/customers'
import issuer from './handlers/issuer'
import policies from './handlers/policies'
import prospects from './handlers/prospects'

const app = new OpenAPIHono()
  .route('/prospects', prospects)
  .route('/policies', policies)
  .route('/customers', customers)
  .route('/issuer', issuer)
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
