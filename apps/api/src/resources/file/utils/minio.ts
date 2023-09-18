import type { BucketItem } from 'minio'
import { s3AccessKey, s3Bucket, s3Port, s3SecretKey, s3Url } from '@/utils/env.js'
import { ServerError } from '@/utils/errors.js'
import { streamToBuffer } from './controllers.js'

const Minio = await import('minio')

const minioClient = new Minio.Client({
  endPoint: s3Url,
  port: +s3Port,
  useSSL: true,
  accessKey: s3AccessKey,
  secretKey: s3SecretKey,
})

export const listBuckets = () => minioClient.listBuckets()

export const listFiles = async (bucketName: string) => {
  const objects: BucketItem[] = []
  const stream = minioClient.listObjectsV2(bucketName)
  await new Promise(resolve => {
    stream.on('data', (chunk) => {
      objects.push(chunk)
    })
    stream.on('end', () => {
      resolve(objects)
    })
    stream.on('error', (error) => {
      throw new ServerError('failed do list minio files', { extras: { error } })
    })
  })
  return objects
}

export const uploadFile = async (bucketName: string, fileName: string, data: Buffer) => {
  return minioClient.putObject(bucketName, fileName, data)
}

export const getFile = async (bucketName: string, fileName: string) => {
  const file = await minioClient.getObject(bucketName, fileName)
  return streamToBuffer(file)
}

export const getFiles = async (objects: BucketItem[]) => {
  return objects?.map(async obj => {
    if (!obj.name) {
      throw new Error('item from s3 have no name')
    }
    return getFile(s3Bucket, obj.name)
  })
}

export const deleteFile = async (bucketName: string, fileName: string) => {
  await minioClient.removeObject(bucketName, fileName)
}
