import type { Stream } from 'node:stream'
import type { SocketStream } from '@fastify/websocket'
import { ServerError } from '@/utils/errors.js'
import { listFiles } from './minio.js'
import { s3Bucket } from '@/utils/env.js'

export const updateFileList = async (clients: Record<string, SocketStream>) => {
  const fileList = await listFiles(s3Bucket)
  Object.values(clients)
    .forEach(client => {
      client.socket.send(JSON.stringify(fileList))
    })
}

export async function streamToBuffer (stream: Stream): Promise<Buffer> {
  return new Promise <Buffer>((resolve, reject) => {
    const buffer = Array <any>()
    stream.on('data', chunk => buffer.push(chunk))
    stream.on('end', () => resolve(Buffer.concat(buffer)))
    stream.on('error', error => reject(new ServerError('error converting stream to buffer', { extras: { error } })))
  })
}
