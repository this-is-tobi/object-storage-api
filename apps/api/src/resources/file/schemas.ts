import type { FastifySchema } from 'fastify'

export const createSchema: FastifySchema = {
  description: 'Upload a file to a MinIO bucket (s3 compatible object storage).',
  tags: ['Files'],
  consumes: ['multipart/form-data'],
  produces: ['application/json'],
  response: {
    201: {
      description: 'Success',
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: { type: 'object' },
      },
    },
    400: {
      description: 'Bad request',
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
    403: {
      description: 'Forbidden',
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
    500: {
      description: 'Internal server error',
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  },
}

export const readAllSchema: FastifySchema = {
  description: 'Get all resources.',
  tags: ['Files'],
  consumes: ['application/json'],
  produces: ['application/json'],
  response: {
    200: {
      description: 'Success',
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: { type: 'array' },
      },
    },
    400: {
      description: 'Bad request',
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
    403: {
      description: 'Forbidden',
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
    500: {
      description: 'Internal server error',
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  },
}

export const readSchema: FastifySchema = {
  description: 'Get resource by its ID.',
  tags: ['Files'],
  consumes: ['application/json'],
  produces: ['application/json'],
  response: {
    200: {
      description: 'Success',
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: { type: 'object' },
      },
    },
    400: {
      description: 'Bad request',
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
    403: {
      description: 'Forbidden',
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
    500: {
      description: 'Internal server error',
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  },
}

export const deleteSchema: FastifySchema = {
  description: 'Delete resource by its ID.',
  tags: ['Files'],
  consumes: ['application/json'],
  produces: ['application/json'],
  response: {
    200: {
      description: 'Success',
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
    400: {
      description: 'Bad request',
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
    403: {
      description: 'Forbidden',
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
    500: {
      description: 'Internal server error',
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  },
}

export const wsSchema: FastifySchema = {
  description: 'Get files from the MinIO object storage',
  tags: ['Websocket'],
  produces: ['application/json'],
  response: {
    200: {
      description: 'Success',
      type: 'object',
      properties: {
        fileList: { type: 'array' },
      },
    },
  },
}
