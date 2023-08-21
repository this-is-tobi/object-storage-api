import fastify, { FastifyContextConfig } from 'fastify'
import helmet from '@fastify/helmet'
import ws from '@fastify/websocket'
import { randomUUID } from 'crypto'
import { loggerConf, handleError, getNodeEnv, miscRouter, apiPrefix } from '@/utils/index.js'
import { fileRouter } from '@/resources/router.js'

const fastifyConf: FastifyContextConfig = {
  logger: loggerConf[getNodeEnv()],
  genReqId: () => randomUUID(),
}

const app = fastify(fastifyConf)
  .register(helmet)
  .register(ws, { options: { maxPayload: 1048576 } })
  .register(miscRouter)
  .register(fileRouter, { prefix: apiPrefix })
  .addHook('onRoute', opts => {
    if (opts.path === '/healthz') {
      opts.logLevel = 'silent'
    }
  })
  .setErrorHandler(handleError)

export default app
