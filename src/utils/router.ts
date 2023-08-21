import type { FastifyRequest, FastifyReply, FastifyInstance, FastifyServerOptions } from 'fastify'
import { sendOk, version } from '@/utils/index.js'

export const apiPrefix: string = '/api/v1'

export const miscRouter = async (app: FastifyInstance, _opts: FastifyServerOptions) => {
  app.get('/version', getVersion)
  app.get('/healthz', getHealth)
}

const getVersion = async (_req: FastifyRequest, res: FastifyReply) => {
  sendOk(res, version)
}

const getHealth = async (_req: FastifyRequest, res: FastifyReply) => {
  sendOk(res, 'OK')
}
