import { createRoute } from '@hono/zod-openapi'
import { policyIdentifiersSchema } from './schemas'

export default createRoute({
  method: 'get',
  path: '/policy',
  responses: {
    200: {
      content: {
        "application/json": {
          schema: policyIdentifiersSchema
        }
      },
      description: 'Obtains a list of existing policy identifiers'
    }
  }
})


