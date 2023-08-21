import type { FastifyServerOptions } from 'fastify'
import type { FastifyInstance } from 'fastify/types/instance'
import { getFilesController, uploadFileController } from '@/resources/controllers.js'

export const fileRouter = async (app: FastifyInstance, _opts: FastifyServerOptions) => {
  app.post('/', uploadFileController)
  app.get('/', { websocket: true }, getFilesController)
}
