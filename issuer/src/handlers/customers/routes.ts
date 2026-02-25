import { createRoute } from '@hono/zod-openapi'
import type { createMiddleware } from 'hono/factory'
import type { Env } from 'hono/types'
import {
  recordCompliancyResponseErrorSchema,
  recordCompliancyQueryParamsSchema, recordCompliancyResponseSchema
} from './schemas'

export default {
  '/recordCompliancy': <E extends Env = Env>(middleware: ReturnType<typeof createMiddleware<E>>) =>
    createRoute({
      middleware,
      method: 'post',
      path: '/recordCompliancy',
      request: {
        body: {
          content: {
            "application/json": {
              schema: recordCompliancyQueryParamsSchema
            }
          }
        }
      },
      responses: {
        200: {
          content: {
            "application/json": {
              schema: recordCompliancyResponseSchema
            }
          },
          description: 'Reports if a customer is compliant or not regarding a policy'
        },
        400: {
          content: {
            "application/json": {
              schema: recordCompliancyResponseErrorSchema
            }
          },
          description: 'Reports if a customer is compliant or not regarding a policy due to bad client request'
        },
        500: {
          content: {
            "application/json": {
              schema: recordCompliancyResponseErrorSchema
            }
          },
          description: 'Reports if a customer is compliant or not regarding a policy due to server error'
        }
      }
    })
}

