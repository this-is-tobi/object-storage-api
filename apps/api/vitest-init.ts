import { vi } from 'vitest'

vi.mock('./src/resources/file/utils/minio.js', () => {
  return {
    listBuckets: vi.fn(),
    listFiles: vi.fn(),
    uploadFile: vi.fn(),
    getFile: () => new Promise((res, rej) => res(Buffer.alloc(10))),
    getFiles: () => new Promise((res, rej) => res([Buffer.alloc(10), Buffer.alloc(10)])),
    deleteFile: vi.fn(),
  }
})
