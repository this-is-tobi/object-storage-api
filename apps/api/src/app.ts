import fastify from 'fastify'
import helmet from '@fastify/helmet'
import websocket from '@fastify/websocket'
import multipart from '@fastify/multipart'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import { swaggerUiConf, swaggerConf, fastifyConf, miscRouter, apiPrefix, handleError } from '@/utils/index.js'
import { fileRouter } from '@/resources/file/router.js'

const app = fastify(fastifyConf)
  .register(helmet)
  .register(multipart)
  .register(websocket, { options: { maxPayload: 1048576 } })
  .register(swagger, swaggerConf)
  .register(swaggerUi, swaggerUiConf)
  .register(miscRouter, { prefix: apiPrefix })
  .register(fileRouter, { prefix: apiPrefix })
  .addHook('onRoute', opts => {
    if (opts.path.includes('/healthz')) {
      opts.logLevel = 'silent'
    }
  })
  .setErrorHandler(handleError)

await app.ready()

export default app
