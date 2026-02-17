import { createRoute } from '@hono/zod-openapi'
import { kycDataSchema, customerSchema, conflictSchema } from './schemas'

export default createRoute({
  method: 'post',
  path: '/register',
  request: {
    body: {
      content: {
        "application/json": {
          schema: kycDataSchema
        }
      }
    }
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: customerSchema
        }
      },
      description: 'register a prospect into a customer'
    },
    409: {
      content: {
        "application/json": {
          schema: conflictSchema
        }
      },
      description: 'triggered when attempting to register an existing customer'
    }
  }
})

