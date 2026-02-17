import { z } from '@hono/zod-openapi'

export const kycDataSchema = z.object({
  firstName: z
    .string()
    .min(1)
    .openapi({
      type: 'string',
      minLength: 1,
      example: 'John'
    }),
  lastName: z
    .string()
    .min(1)
    .openapi({
      type: 'string',
      minLength: 1,
      example: 'Doe'
    }),
  email: z
    .email()
    .openapi({
      example: 'john.doe@unknown.ufo'
    })
    .openapi('KYCData')
})

export const customerSchema = z.object({
  firstName: z
    .string()
    .min(1)
    .openapi({
      type: 'string',
      minLength: 1,
      example: 'John'
    }),
  lastName: z
    .string()
    .min(1)
    .openapi({
      type: 'string',
      minLength: 1,
      example: 'Doe'
    }),
  email: z
    .email()
    .openapi({
      example: 'john.doe@unknown.ufo'
    })
    .openapi('KYCData'),
  id: z
    .number()
    .min(0)
    .openapi({
      example: 0
    })
})

export const conflictSchema = z.object({
  error: z
    .string()
    .openapi({
      default: 'This customer is already registered'
    })
})
