import { z } from '@hono/zod-openapi'

export const policyIdentifiersSchema = z.array(z.number().min(0))
  .openapi({
    description: 'A list of policy identifiers'
  })

export const policyIdentifierParameterSchema = z.object({
  id: z
    .string()
    .regex(/^(0|[1-9]\d*)$/)
    .openapi({
      param: {
        name: 'id',
        in: 'path'
      },
      example: '0',
      description: 'A policy identifier, must be convertible to positive integer'
    })
})

export const policyNotFoundSchema = z.object({
  error: z
    .string()
    .nonempty()
    .openapi({
      description: 'Error message when a policy with this identifier is not found'
    })
})

export const policySchema = z.object({
  id: z
    .number()
    .min(0)
    .openapi({
      description: 'A policy identifier',
      example: 0
    }),
  assetName: z
    .string()
    .trim()
    .min(1)
    .openapi({
      description: 'The managed real world asset name',
      example: 'RWA_GOLD_ONE_OUNCE'
    }),
  scope: z
    .object({
      name: z
        .string()
        .trim()
        .min(1)
        .openapi({
          description: 'The scope name of this policy',
          example: 'RWA_HOLD'
        }),
      validityMode: z
        .string()
        .includes('timestamp')
        .openapi({
          description: 'the validity mode of this RWA policy',
          example: 'timestamp'
        })
    })
})
