import app from '@/app.js'
import { port } from '@/utils/index.js'

const startServer = async () => {
  try {
    await app.listen({ port: +port })
  } catch (error) {
    app.log.error(error)
    process.exit(1)
  }
  process.on('unhandledRejection', (err: Error) => {
    app.log.warn(err)
    process.exit(1)
  })
}

const handleExit = () => {
  process.on('exit', exitGracefully)
  process.on('SIGINT', exitGracefully)
  process.on('SIGTERM', exitGracefully)
  process.on('uncaughtException', exitGracefully)
}

const exitGracefully = (error: Error) => {
  if (error instanceof Error) {
    app.log.error(error)
  }
  app.log.info('Exiting...')
  process.exit(error instanceof Error ? 1 : 0)
}

await startServer()
handleExit()
