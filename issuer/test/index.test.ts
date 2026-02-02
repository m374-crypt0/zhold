import { describe, it, expect } from 'bun:test'

import app from '../src/'

describe('Prospect registration', () => {
  it('should fail if no data is passed', async () => {
    const req = new Request('http://localhost:3000/register')
    const res = await app.fetch(req)

    expect(res.status).toBe(400)
  })
})
