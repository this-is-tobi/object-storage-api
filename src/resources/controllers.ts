import { randomUUID } from 'node:crypto'
import type { FastifyReply, FastifyRequest } from 'fastify'
import type { SocketStream } from '@fastify/websocket'
import type { MultipartFile } from '@fastify/multipart'
import { addReqLogs } from '@/utils/logger.js'
import { sendCreated, sendServerError } from '@/utils/responses.js'
import { updateFileList, streamToBuffer } from '@/resources/utils/controllers.js'
import { s3Bucket } from '@/utils/env.js'
import { getFile, listFiles, uploadFile } from '@/resources/utils/minio.js'
import { BadRequestError, ServerError } from '@/utils/errors.js'

const clients: Record<string, SocketStream> = {}

export const uploadFileController = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const data: MultipartFile | undefined = await req.file()
    if (!data) throw new BadRequestError('no data received')
    const filename = data.filename
    const buffer = await streamToBuffer(data.file)

    addReqLogs({ req, description: 'Upload file requested', extras: { filename } })
    uploadFile(s3Bucket, filename, buffer)
    updateFileList(clients, buffer)

    sendCreated(res, 'File uploaded successfully')
  } catch (error) {
    sendServerError(res, { error })
  }
}

export const getFilesController = async (connection: SocketStream, req: FastifyRequest) => {
  const clientId: string = randomUUID()
  clients[clientId] = connection

  addReqLogs({ req, description: 'Client connected', extras: { clientId } })
  try {
    const objects = await listFiles(s3Bucket)
    objects.forEach(async obj => {
      const file = await getFile(s3Bucket, obj.name)
      const buffer = await streamToBuffer(file)
      connection.write(buffer)
    })
  // connection.write(JSON.stringify({ objects }))
  } catch (error) {
    throw new ServerError('failed to retrieve files from s3 bucket', { extras: { error } })
  }

  connection.socket.on('close', () => {
    addReqLogs({ req, description: 'Client disconnected', extras: { clientId } })
  })
}
