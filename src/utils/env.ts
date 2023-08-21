// api
export const port: string = process.env.API_PORT ?? '8080'
export const version: string = process.env.APP_VERSION ?? 'dev'

// s3
export const s3Url: string = process.env.S3_URL ?? ''
export const s3Port: string = process.env.S3_PORT ?? ''
export const s3Bucket: string = process.env.S3_BUCKET ?? ''
export const s3AccessKey: string = process.env.S3_ACCESS_KEY ?? ''
export const s3SecretKey: string = process.env.S3_SECRET_KEY ?? ''
