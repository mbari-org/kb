import { describe, expect, it, vi } from 'vitest'

import request from '@/lib/services/request'

const response = (status, body = {}) => ({
  json: vi.fn().mockResolvedValue(body),
  status,
  statusText: status === 401 ? 'Unauthorized' : 'OK',
})

describe('request', () => {
  it('uses the requested service token and refreshes it once after a 401', async () => {
    const config = {
      getServiceToken: vi.fn().mockResolvedValue('annosaurus-token'),
      getServiceUrl: vi.fn().mockReturnValue({ url: 'https://example.test/anno/v1' }),
      refreshServiceToken: vi.fn().mockResolvedValue('refreshed-annosaurus-token'),
    }
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(response(401, { message: 'expired' }))
      .mockResolvedValueOnce(response(200, { ok: true }))

    const result = await request('annosaurus', 'PUT')({
      config,
      data: { value: 'new-value' },
      path: ['associations', 'rename'],
    })

    expect(result).toEqual({ payload: { ok: true }, status: 200 })
    expect(config.getServiceToken).toHaveBeenCalledWith('annosaurus')
    expect(config.refreshServiceToken).toHaveBeenCalledWith('annosaurus')
    expect(fetch).toHaveBeenNthCalledWith(
      1,
      'https://example.test/anno/v1/associations/rename',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer annosaurus-token',
        }),
      })
    )
    expect(fetch).toHaveBeenNthCalledWith(
      2,
      'https://example.test/anno/v1/associations/rename',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer refreshed-annosaurus-token',
        }),
      })
    )
  })

  it('uses the Oni user token and refreshes it once after a 401', async () => {
    const config = {
      getOniUserToken: vi.fn().mockResolvedValue('oni-user-token'),
      getServiceUrl: vi.fn().mockReturnValue({ url: 'https://example.test/oni/v1' }),
      refreshOniUserToken: vi.fn().mockResolvedValue('refreshed-oni-user-token'),
    }
    globalThis.fetch = vi.fn()
      .mockResolvedValueOnce(response(401, { message: 'expired' }))
      .mockResolvedValueOnce(response(200, { ok: true }))

    const result = await request('oni', 'PUT', 'user')({
      config,
      data: { newName: 'CDF_new' },
      path: ['names', 'CDF'],
    })

    expect(result).toEqual({ payload: { ok: true }, status: 200 })
    expect(config.getOniUserToken).toHaveBeenCalledWith()
    expect(config.refreshOniUserToken).toHaveBeenCalledWith()
    expect(fetch).toHaveBeenNthCalledWith(
      1,
      'https://example.test/oni/v1/names/CDF',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer oni-user-token',
        }),
      })
    )
    expect(fetch).toHaveBeenNthCalledWith(
      2,
      'https://example.test/oni/v1/names/CDF',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer refreshed-oni-user-token',
        }),
      })
    )
  })
})
