import { describe, expect, it, vi } from 'vitest'

import createServiceTokenManager from '@/lib/services/auth/serviceTokens'

const tokenWithExpiry = () => {
  const payload = btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 })).replace(/=+$/, '')
  return `header.${payload}.signature`
}

describe('createServiceTokenManager concurrent exchange', () => {
  it('shares an in-flight exchange between concurrent requests', async () => {
    const getServiceUrl = () => ({ secret: 'api-key', url: 'https://example.test/anno/v1' })
    const token = tokenWithExpiry()
    let resolveResponse
    globalThis.fetch = vi.fn().mockReturnValue(
      new Promise(resolve => {
        resolveResponse = () => resolve({
          json: vi.fn().mockResolvedValue({ access_token: token }),
          status: 200,
        })
      })
    )

    const manager = createServiceTokenManager({ getServiceUrl, razielToken: 'raziel-token' })
    const first = manager.getServiceToken('annosaurus')
    const second = manager.getServiceToken('annosaurus')
    resolveResponse()

    await expect(Promise.all([first, second])).resolves.toEqual([token, token])
    expect(fetch).toHaveBeenCalledTimes(1)
  })
})
