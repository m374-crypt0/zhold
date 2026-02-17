import { createRoute } from '@hono/zod-openapi'
import { policyIdentifiersSchema } from './schemas'
import type { createMiddleware } from 'hono/factory'
import type { Env } from 'hono/types'

export const createRouteWithMiddleware = <E extends Env = Env>(middleware: ReturnType<typeof createMiddleware<E>>) =>
  createRoute({
    middleware,
    method: 'get',
    path: '/policy',
    responses: {
      200: {
        content: {
          "application/json": {
            schema: policyIdentifiersSchema
          }
        },
        description: 'Obtains a list of existing policy identifiers'
      }
    }
  })


