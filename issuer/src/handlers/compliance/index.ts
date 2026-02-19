import { OpenAPIHono } from '@hono/zod-openapi'
import routes from './routes'
import { createMiddleware } from 'hono/factory'

type ComplianceEnv = {
  Bindings: {}
}

const injectRepositories = createMiddleware<ComplianceEnv>(async (c, next) => {
  await next()
})

export default new OpenAPIHono<ComplianceEnv>()
  .openapi(routes['/compliance'](injectRepositories),
    async (c) => {
      return c.json({ error: 'This customer does not exist' }, 400)
    })
