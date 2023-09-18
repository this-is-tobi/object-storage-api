import { describe, it, expect } from 'vitest'
import app from '@/app.js'
import formAutoContent from 'form-auto-content'
import { apiPrefix } from '@/utils/index.js'

describe('Examples resources', () => {
  describe('POST', () => {
    it('Should create new resource', async () => {
      const form = formAutoContent({
        myField: 'file01.png',
        myFile: Buffer.alloc(10),
      })

      const response = await app.inject({
        method: 'post',
        url: `${apiPrefix}/files`,
        ...form,
      })

      expect(response.statusCode).toEqual(201)
      expect(response.body).toEqual('File uploaded successfully')
    })

    it('Should not create new resource - missing required key', async () => {
      const response = await app.inject({
        method: 'post',
        url: `${apiPrefix}/files`,
      })

      expect(response.statusCode).toEqual(500)
    })
  })

  describe('GET - all', () => {
    it('Should retrieve all resources', async () => {
      const response = await app.inject()
        .get(`${apiPrefix}/files`)
        .end()

      expect(response.statusCode).toEqual(200)
      expect(Buffer.from(response.body)).toEqual(Buffer.concat([Buffer.alloc(10), Buffer.alloc(10)]))
    })
  })

  describe('GET', () => {
    it('Should retrieve resource by its ID', async () => {
      const response = await app.inject()
        .get(`${apiPrefix}/files/1`)
        .end()

      expect(response.statusCode).toEqual(200)
      expect(Buffer.from(response.body)).toEqual(Buffer.alloc(10))
    })
  })

  describe('DELETE', () => {
    it('Should delete resource by its ID', async () => {
      const response = await app.inject()
        .delete(`${apiPrefix}/files/file01.png`)
        .end()

      expect(response.statusCode).toEqual(200)
    })
  })
})
