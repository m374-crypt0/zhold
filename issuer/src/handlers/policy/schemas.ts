import { z } from '@hono/zod-openapi'

export const policyIdentifiersSchema = z.array(z.number().min(0))
  .openapi({
    description: 'A list of policy identifiers'
  })
