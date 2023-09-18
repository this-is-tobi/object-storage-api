import type { FastifyServerOptions, FastifyInstance } from 'fastify'
import { createSchema, deleteSchema, readAllSchema, readSchema, wsSchema } from './schemas.js'
import { createResource, getResources, getResourceByName, deleteResource, wsController } from './controllers.js'

export const fileRouter = async (app: FastifyInstance, _opts: FastifyServerOptions) => {
  app.post('/files', { schema: createSchema }, createResource)
  app.get('/files', { schema: readAllSchema }, getResources)
  app.get('/files/:name', { schema: readSchema }, getResourceByName)
  app.delete('/files/:name', { schema: deleteSchema }, deleteResource)
  app.get('/files/ws', { schema: wsSchema, websocket: true }, wsController)
}
