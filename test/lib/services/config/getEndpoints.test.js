import { beforeEach, describe, expect, it, vi } from 'vitest'

import getEndpoints from '@/lib/services/config/getEndpoints'

describe('getEndpoints', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('requests the catalog with the Raziel bearer and preserves endpoint metadata', async () => {
    const endpoints = [
      {
        name: 'oni',
        secret: 'oni-api-key',
        url: 'https://localhost/kb/v1',
      },
    ]
    globalThis.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(endpoints),
      status: 200,
    })

    const result = await getEndpoints('https://localhost/config', 'raziel-token')

    expect(result.endpoints).toEqual([
      {
        name: 'oni',
        secret: 'oni-api-key',
        url: `${globalThis.location.origin}/kb/v1`,
      },
    ])
    expect(fetch).toHaveBeenCalledWith(
      `${globalThis.location.origin}/config/endpoints`,
      expect.objectContaining({
        headers: {
          Authorization: 'Bearer raziel-token',
        },
        method: 'GET',
      })
    )
  })

  it('uses a custom config service URL and preserves remote endpoint URLs in development', async () => {
    const endpoints = [
      {
        name: 'oni',
        secret: 'oni-api-key',
        url: 'https://wtf.com/kb/v1',
      },
    ]
    globalThis.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(endpoints),
      status: 200,
    })

    const result = await getEndpoints('http://wtf.com/config', 'raziel-token')

    expect(result.endpoints).toEqual(endpoints)
    expect(fetch).toHaveBeenCalledWith(
      'http://wtf.com/config/endpoints',
      expect.objectContaining({
        headers: {
          Authorization: 'Bearer raziel-token',
        },
        method: 'GET',
      })
    )
  })

  it('adds the local Config Service context when only the host is entered', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue([]),
      status: 200,
    })

    await getEndpoints('https://localhost', 'raziel-token')

    expect(fetch).toHaveBeenCalledWith(
      `${globalThis.location.origin}/config/endpoints`,
      expect.objectContaining({
        headers: {
          Authorization: 'Bearer raziel-token',
        },
      })
    )
  })
})
