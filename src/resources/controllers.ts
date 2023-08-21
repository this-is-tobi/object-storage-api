import type { SocketStream } from '@fastify/websocket'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { randomUUID } from 'crypto'
import { addReqLogs } from '@/utils/index.js'
import { updateFileList } from '@/resources/utils/controllers.js'
// import { uploadFile } from '@/resources/utils/minio.js'

let files: string[] = []
const clients: Record<string, SocketStream> = {}

export const getFilesController = (connection: SocketStream, req: FastifyRequest) => {
  const clientId: string = randomUUID()
  clients[clientId] = connection

  addReqLogs({ req, description: 'Client connected', extras: { clientId } })

  connection.socket.on('close', () => {
    addReqLogs({ req, description: 'Client disconnected', extras: { clientId } })
  })
}

export const uploadFileController = async (req: FastifyRequest, res: FastifyReply) => {
  const data: any = req.body

  addReqLogs({ req, description: 'Upload file requested', extras: { data: JSON.stringify(data) } })

  files = [...files, data.file]

  addReqLogs({ req, description: 'Upload file requested', extras: { data: JSON.stringify(data) } })

  res.send('File uploaded successfully')
  updateFileList(clients, files)
}
