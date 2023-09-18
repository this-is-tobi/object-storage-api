import { randomUUID } from 'node:crypto'
import type { FastifyReply, FastifyRequest } from 'fastify'
import type { SocketStream } from '@fastify/websocket'
import type { MultipartFile } from '@fastify/multipart'
import { BadRequestError, ServerError, addReqLogs, sendCreated, sendOk } from '@/utils/index.js'
import { streamToBuffer, updateFileList } from './utils/controllers.js'
import { deleteFile, getFile, getFiles, listFiles, uploadFile } from './utils/minio.js'
import { s3Bucket } from '@/utils/env.js'

export const createResource = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const data: MultipartFile | undefined = await req.file()
    if (!data) throw new BadRequestError('no data received')
    const fileName = data.filename
    const buffer = await streamToBuffer(data.file)

    addReqLogs({ req, description: 'Upload file requested', extras: { fileName } })
    await uploadFile(s3Bucket, fileName, buffer)
    await updateFileList(clients)

    sendCreated(res, 'File uploaded successfully')
  } catch (error) {
    throw new ServerError('failed to create resource', { extras: { error } })
  }
}

export const getResources = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const objects = await listFiles(s3Bucket)
    const files = await Promise.all(await getFiles(objects))

    const message = 'resources successfully retrieved'
    addReqLogs({ req, description: message })

    res.type('image/png').send(Buffer.concat(files))
  } catch (error) {
    throw new ServerError('failed to retrieves resources', { extras: { error } })
  }
}

export const getResourceByName = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const { name: fileName } = req.params as Record<string, any>
    const file = await getFile(s3Bucket, fileName)

    const message = 'resource successfully retrieved'
    addReqLogs({ req, description: message, extras: { fileName } })

    res.type('image/png').send(file)
  } catch (error) {
    throw new ServerError('failed to retrieve resource', { extras: { error } })
  }
}

export const deleteResource = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const { name: fileName } = req.params as Record<string, any>

    addReqLogs({ req, description: 'Delete file requested', extras: { fileName } })
    console.log('test')
    await deleteFile(s3Bucket, fileName)
    await updateFileList(clients)

    sendOk(res, 'resource successfully deleted')
  } catch (error) {
    throw new ServerError('failed to delete resource', { extras: { error } })
  }
}

// Websocket file list notification
const clients: Record<string, SocketStream> = {}

export const wsController = async (connection: SocketStream, req: FastifyRequest) => {
  const clientId: string = randomUUID()
  clients[clientId] = connection

  addReqLogs({ req, description: 'Client connected', extras: { clientId } })

  connection.socket.on('message', async _message => {
    try {
      await updateFileList(clients)
    } catch (error) {
      throw new ServerError('failed to retrieve files from s3 bucket', { extras: { error } })
    }
  })

  connection.socket.on('close', () => {
    addReqLogs({ req, description: 'Client disconnected', extras: { clientId } })
  })
}
