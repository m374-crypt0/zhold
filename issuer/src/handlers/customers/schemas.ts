import { z } from '@hono/zod-openapi'
import { policyParametersSchema } from '../policies/schemas'

export const recordCompliancyQueryParamsSchema = z.object({
  customerId: z
    .number()
    .min(0)
    .openapi({
      description: 'The identifier of a registered customer',
      example: 0
    }),
  policy: z
    .object({
      id: z
        .number()
        .min(0)
        .openapi({
          description: 'The identifier of an existing policy',
          example: 0
        }),
      parameters: policyParametersSchema
    })
    .openapi({
      description: 'The policy and its parameters'
    })
})
  .openapi({
    description: 'Parameters needed to ensure a customer is compliant regarding a policy'
  })


export const recordCompliancyResponseSchema = z.object({
  result: z
    .boolean()
    .openapi({
      description: 'result of the compliancy check',
      example: true
    })
})
  .openapi({
    description: 'The result of compliancy between a customer and a specific policy. If true, the commitment is stored on-chain'
  })

export const recordCompliancyBadQueryParamsSchema = z.object({
  error: z
    .string()
    .min(1)
})
  .openapi({
    description: 'Explains why this compliance request is a bad request'
  })
