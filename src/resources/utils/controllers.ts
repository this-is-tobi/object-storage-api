import type { Stream } from 'node:stream'
import type { SocketStream } from '@fastify/websocket'
import { ServerError } from '@/utils/errors.js'

export const updateFileList = (clients: Record<string, SocketStream>, data: Buffer) => {
  Object
    .values(clients)
    .forEach(client => client.write(data))
}

export async function streamToBuffer (stream: Stream): Promise<Buffer> {
  return new Promise <Buffer>((resolve, reject) => {
    const buf = Array <any>()
    stream.on('data', chunk => buf.push(chunk))
    stream.on('end', () => resolve(Buffer.concat(buf)))
    stream.on('error', error => reject(new ServerError('error converting stream to buffer', { extras: { error } })))
  })
}
