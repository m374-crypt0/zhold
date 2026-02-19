import { z } from '@hono/zod-openapi'

export const complianceQueryParamsSchema = z.object({
  customerId: z
    .string()
    .regex(/^(0|[1-9]\d*)$/)
    .openapi({
      description: 'The identifier of a registered customer',
      example: 0
    }),
  policyId: z
    .string()
    .regex(/^(0|[1-9]\d*)$/)
    .openapi({
      description: 'The identifier of an existing policy',
      example: 0
    })
})
  .openapi({
    description: 'Parameters needed to ensure a customer is compliant regarding a policy'
  })

export const complianceResponseSchema = z.object({
  result: z
    .boolean()
    .openapi({
      description: 'result of the compliancy check',
      example: true
    })
})
  .openapi({
    description: 'The result of compliancy between a customer and a specific policy'
  })

export const complianceBadQueryParamsSchema = z.object({
  error: z
    .string()
    .min(1)
})
  .openapi({
    description: 'Explains why this compliance request is a bad request'
  })
