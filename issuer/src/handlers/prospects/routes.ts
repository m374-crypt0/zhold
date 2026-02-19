import { createRoute } from '@hono/zod-openapi'
import { kycDataSchema, customerSchema, conflictSchema } from './schemas'
import type { createMiddleware } from 'hono/factory'
import type { Env } from 'hono/types'

export const createRouteWithMiddleware = <E extends Env = Env>(middleware: ReturnType<typeof createMiddleware<E>>) =>
  createRoute({
    middleware,
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

