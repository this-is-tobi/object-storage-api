import fastify from 'fastify'
import helmet from '@fastify/helmet'
import websocket from '@fastify/websocket'
import multipart from '@fastify/multipart'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import { fastifyConf, swaggerUiConf, swaggerConf } from '@/utils/fastify.js'
import { miscRouter, apiPrefix } from '@/utils/router.js'
import { handleError } from '@/utils/errors.js'
import { fileRouter } from '@/resources/router.js'

const app = fastify(fastifyConf)
  .register(helmet)
  .register(multipart)
  .register(swagger, swaggerConf)
  .register(swaggerUi, swaggerUiConf)
  .register(websocket, { options: { maxPayload: 1048576 } })
  .register(miscRouter, { prefix: apiPrefix })
  .register(fileRouter, { prefix: apiPrefix })
  .addHook('onRoute', opts => {
    if (opts.path === '/healthz') {
      opts.logLevel = 'silent'
    }
  })
  .setErrorHandler(handleError)

await app.ready()

export default app
