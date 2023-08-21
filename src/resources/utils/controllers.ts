import type { SocketStream } from '@fastify/websocket'

export const updateFileList = (clients: Record<string, SocketStream>, files: string[]) => {
  return Object
    .values(clients)
    .forEach(client => client.write(JSON.stringify({ files })))
}
