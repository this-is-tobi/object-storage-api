import Minio from 'minio'
import { s3AccessKey, s3Port, s3SecretKey, s3Url } from '@/utils/index.js'

const minioClient = new Minio.Client({
  endPoint: s3Url,
  port: +s3Port,
  useSSL: true,
  accessKey: s3AccessKey,
  secretKey: s3SecretKey,
})

export const uploadFile = async (bucketName: string, objectName: string, fileName: string) => {
  const metaData = {
    'Content-Type': 'application/octet-stream',
  }
  minioClient.fPutObject(bucketName, objectName, fileName, metaData, function (err, _etag) {
    if (err) throw err
  })
}
