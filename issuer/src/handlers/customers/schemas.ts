import { z } from '@hono/zod-openapi'

export const recordCompliancyQueryParamsSchema = z.object({
  customerId: z
    .string()
    .regex(/^(0|[1-9]\d*)$/)
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
      parameters: z
        .array(z.object({
          key: z
            .string()
            .nonempty()
            .openapi({
              description: 'The name of the policy parameter',
              example: 'validUntil'
            }),
          value: z
            .string()
            .nonempty()
            .openapi({
              description: 'The value of the policy parameter',
              example: '1770297431'
            })
        }))
        .openapi({
          description: 'An array of key-value pairs for each policy parameter'
        })
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
    description: 'The result of compliancy between a customer and a specific policy'
  })

export const recordCompliancyBadQueryParamsSchema = z.object({
  error: z
    .string()
    .min(1)
})
  .openapi({
    description: 'Explains why this compliance request is a bad request'
  })
