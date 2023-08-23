import type { FastifySchema, FastifyServerOptions, FastifyInstance } from 'fastify'
import { getFilesController, uploadFileController } from '@/resources/controllers.js'

export const fileRouter = async (app: FastifyInstance, _opts: FastifyServerOptions) => {
  app.post('/files', { schema: uploadSchema }, uploadFileController)
  app.get('/files', { schema: listSchema, websocket: true }, getFilesController)
}

const uploadSchema: FastifySchema = {
  description: 'Upload a file to a MinIO bucket, an s3 compatible object storage.',
  tags: ['Files'],
  consumes: ['multipart/form-data'],
  // body: {
  //   type: 'object',
  //   required: ['file'],
  //   properties: {
  //     file: { type: 'string', description: 'File to upload' },
  //     // file: { isFile: true, description: 'File to upload' },
  //   },
  // },
  response: {
    201: {
      description: 'Successful response',
      type: 'object',
      properties: {
        message: { type: 'string', value: 'File successfully uploaded' },
      },
    },
  },
}

const listSchema: FastifySchema = {
  description: 'Get files from the MinIO object storage',
  tags: ['Websocket'],
  response: {
    200: {
      description: 'Successful response',
      type: 'object',
      properties: {
        files: { type: 'string' },
      },
    },
  },
}
