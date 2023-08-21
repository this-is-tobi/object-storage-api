import type { FastifyRequest } from 'fastify'
import type { PinoLoggerOptions } from 'fastify/types/logger'

type LoggerConf = {
  development: PinoLoggerOptions
  production: boolean,
  test: boolean,
}

interface ReqLogsInput {
  req: FastifyRequest<any>;
  error?: string | Error;
  description: string;
  extras?: Record<string, string>
}

export const loggerConf: LoggerConf = {
  development: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'yyyy-mm-dd - HH:MM:ss Z',
        ignore: 'pid,hostname',
        colorize: true,
        singleLine: true,
      },
    },
  },
  production: true,
  test: false,
}

export const addReqLogs = ({ req, error, description, extras }: ReqLogsInput) => {
  const e = new Error()
  const frame = e.stack?.split('\n')[2]

  const logInfos = {
    file: frame?.split(' ')[6].split(':')[0].split('src/')[1],
    function: frame?.split(' ')[5].split('.')[1],
    description,
    ...extras,
  }

  if (error) {
    req.log.error({
      ...logInfos,
      error: {
        message: typeof error === 'string' ? error : error?.message,
        trace: error instanceof Error && error?.stack,
      },
    },
    'processing request')
    return
  }

  req.log.info(logInfos, 'processing request')
}
