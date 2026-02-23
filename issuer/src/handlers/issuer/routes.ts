import { createRoute } from '@hono/zod-openapi'
import type { createMiddleware } from 'hono/factory'
import type { Env } from 'hono/types'
import {
  revokeCommitmentErrorParamsSchema,
  revokeCommitmentQueryParamsSchema,
  revokeCommitmentResponseSchema
} from './schemas'

export default {
  '/revokeCommitment': <E extends Env = Env>(middleware: ReturnType<typeof createMiddleware<E>>) =>
    createRoute({
      middleware,
      method: 'post',
      path: '/revokeCommitment',
      request: {
        body: {
          content: {
            "application/json": {
              schema: revokeCommitmentQueryParamsSchema
            }
          }
        }
      },
      responses: {
        200: {
          content: {
            "application/json": {
              schema: revokeCommitmentResponseSchema
            }
          },
          description: 'Reports the issuer correctly revoked a commitment on-chain'
        },
        400: {
          content: {
            "application/json": {
              schema: revokeCommitmentErrorParamsSchema
            }
          },
          description: 'Reports the issuer failed to revoke the commitment on-chain because of bad request'
        },
        500: {
          content: {
            "application/json": {
              schema: revokeCommitmentErrorParamsSchema
            }
          },
          description: 'Reports the issuer failed to revoke the commitment on-chain because of server error'
        }
      }
    })
}


