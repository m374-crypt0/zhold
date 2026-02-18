import { createRoute } from '@hono/zod-openapi'
import type { createMiddleware } from 'hono/factory'
import type { Env } from 'hono/types'
import { complianceBadQueryParamsSchema, complianceQueryParamsSchema, complianceResponseSchema } from './schemas'

export default {
  '/compliance': <E extends Env = Env>(middleware: ReturnType<typeof createMiddleware<E>>) =>
    createRoute({
      middleware,
      method: 'get',
      path: '/compliance',
      request: {
        params: complianceQueryParamsSchema
      },
      responses: {
        200: {
          content: {
            "application/json": {
              schema: complianceResponseSchema
            }
          },
          description: 'Reports if a customer is compliant or not regarding a policy'
        },
        400: {
          content: {
            "application/json": {
              schema: complianceBadQueryParamsSchema
            }
          },
          description: 'Reports if a customer is compliant or not regarding a policy'
        }
      }
    })
}

