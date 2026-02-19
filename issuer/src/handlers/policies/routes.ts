import { createRoute } from '@hono/zod-openapi'
import {
  policyIdentifiersSchema, policyIdentifierParameterSchema,
  policySchema, policyNotFoundSchema
} from './schemas'
import type { createMiddleware } from 'hono/factory'
import type { Env } from 'hono/types'

export default {
  '/listIdentifiers': <E extends Env = Env>(middleware: ReturnType<typeof createMiddleware<E>>) =>
    createRoute({
      middleware,
      method: 'get',
      path: '/listIdentifiers',
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
    }),
  '/{id}': <E extends Env = Env>(middleware: ReturnType<typeof createMiddleware<E>>) =>
    createRoute({
      middleware,
      method: 'get',
      path: '/{id}',
      request: {
        params: policyIdentifierParameterSchema
      },
      responses: {
        200: {
          content: {
            'application/json': {
              schema: policySchema
            }
          },
          description: 'Response with properties of a policy from an existing policy identifier'
        },
        404: {
          content: {
            'application/json': {
              schema: policyNotFoundSchema
            }
          },
          description: 'Response in case of unexisting policy'
        }
      }
    })
}
