import type { BucketItem } from 'minio'
import { s3AccessKey, s3Port, s3SecretKey, s3Url } from '@/utils/env.js'
import { ServerError } from '@/utils/errors.js'

const Minio = await import('minio')

const minioClient = new Minio.Client({
  endPoint: s3Url,
  port: +s3Port,
  useSSL: true,
  accessKey: s3AccessKey,
  secretKey: s3SecretKey,
})

export const uploadFile = (bucketName: string, fileName: string, data: Buffer) => {
  minioClient.putObject(bucketName, fileName, data, (err, _etag) => {
    if (err) throw err
  })
}

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

export const getFile = async (bucketName: string, fileName: string) => {
  return minioClient.getObject(bucketName, fileName)
}
