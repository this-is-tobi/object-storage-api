import { randomUUID } from 'node:crypto'
import type { FastifyContextConfig } from 'fastify'
import type { FastifySwaggerUiOptions } from '@fastify/swagger-ui/types/index.js'
import type { SwaggerOptions } from '@fastify/swagger'
import { ajvFilePlugin } from '@fastify/multipart'
import { loggerConf } from './logger.js'
import { getNodeEnv } from './functions.js'
import { port, version } from './env.js'

export const fastifyConf: FastifyContextConfig = {
  logger: loggerConf[getNodeEnv()],
  genReqId: () => randomUUID(),
  ajv: {
    // Adds the file plugin to help @fastify/swagger schema generation
    plugins: [ajvFilePlugin],
  },
}

export const swaggerConf: SwaggerOptions = {
  swagger: {
    info: {
      title: 'File storage API',
      description: 'Manage file through s3 compatible object storage',
      version,
    },
    host: `localhost:${port}`,
    schemes: ['http', 'https', 'ws', 'wss'],
    consumes: ['application/json', 'multipart/form-data'],
    produces: ['application/json'],
    tags: [
      { name: 'Files', description: 'Files related end-points' },
      { name: 'System', description: 'System related end-points' },
      { name: 'Websocket', description: 'Websocket related end-points' },
    ],
    // definitions: {
    //   User: {
    //     type: 'object',
    //     required: ['id', 'email'],
    //     properties: {
    //       id: { type: 'string', format: 'uuid' },
    //       firstName: { type: 'string' },
    //       lastName: { type: 'string' },
    //       email: { type: 'string', format: 'email' },
    //     },
    //   },
    // },
    // securityDefinitions: {
    //   apiKey: {
    //     type: 'apiKey',
    //     name: 'apiKey',
    //     in: 'header',
    //   },
    // },
  },
}

export const swaggerUiConf: FastifySwaggerUiOptions = {
  routePrefix: '/documentation',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: false,
  },
}
