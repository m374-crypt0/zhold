import { z } from '@hono/zod-openapi'

export const revokeCommitmentQueryParamsSchema = z.object({
  commitment: z
    .string()
    .nonempty()
    .openapi({
      description: 'The commitment to revoke on-chain'
    })
})
  .openapi({
    description: 'Parameters needed to revoke a commitment previously stored oin-chain'
  })


export const revokeCommitmentResponseSchema = z.object({
  result: z
    .boolean()
    .openapi({
      description: 'result of the commitment revocation',
      example: true
    })
})
  .openapi({
    description: 'The result of commitment revocation by the issuer'
  })

export const revokeCommitmentErrorParamsSchema = z.object({
  error: z
    .string()
    .min(1)
})
  .openapi({
    description: 'Explains why the commitment revocation failed'
  })

