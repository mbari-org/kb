import { beforeEach, describe, expect, it, vi } from 'vitest'

import createServiceTokenManager from '@/lib/services/auth/serviceTokens'

const tokenWithExpiry = (exp = Math.floor(Date.now() / 1000) + 3600) => {
  const payload = btoa(JSON.stringify({ exp })).replace(/=+$/, '')
  return `header.${payload}.signature`
}

const response = token => ({
  json: vi.fn().mockResolvedValue({ access_token: token }),
  status: 200,
})

describe('createServiceTokenManager', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('exchanges and caches an independent token for each service', async () => {
    const getServiceUrl = vi.fn(service => ({
      secret: `${service}-api-key`,
      url: `https://example.test/${service}/v1`,
    }))
    const annosaurusToken = tokenWithExpiry()
    const oniToken = tokenWithExpiry()
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(response(annosaurusToken))
      .mockResolvedValueOnce(response(oniToken))

    const manager = createServiceTokenManager({ getServiceUrl, razielToken: 'raziel-token' })

    expect(await manager.getServiceToken('annosaurus')).toBe(annosaurusToken)
    expect(await manager.getServiceToken('annosaurus')).toBe(annosaurusToken)
    expect(await manager.getServiceToken('oni')).toBe(oniToken)
    expect(await manager.getServiceToken('raziel')).toBe('raziel-token')
    expect(fetch).toHaveBeenCalledTimes(2)
    expect(fetch).toHaveBeenNthCalledWith(
      1,
      'https://example.test/annosaurus/v1/auth',
      expect.objectContaining({
        headers: {
          Accept: 'application/json',
          Authorization: 'APIKEY annosaurus-api-key',
        },
        method: 'POST',
      })
    )
  })

  it('logs in to Oni separately for a user token', async () => {
    const getServiceUrl = vi.fn(service => ({
      secret: `${service}-api-key`,
      url: `https://example.test/${service}/v1`,
    }))
    const oniUserToken = tokenWithExpiry()
    globalThis.fetch = vi.fn().mockResolvedValue(response(oniUserToken))

    const manager = createServiceTokenManager({
      getServiceUrl,
      oniUserCredentials: { password: 'password', username: 'admin' },
      razielToken: 'raziel-token',
    })

    expect(await manager.getOniUserToken()).toBe(oniUserToken)
    expect(fetch).toHaveBeenCalledWith(
      'https://example.test/oni/v1/auth/login',
      expect.objectContaining({
        headers: {
          Accept: 'application/json',
          Authorization: `Basic ${btoa('admin:password')}`,
        },
        method: 'POST',
      })
    )
    expect(getServiceUrl).toHaveBeenCalledWith('oni')
  })

  it('uses the read-only token when service API keys are unavailable', async () => {
    const readOnlyToken = tokenWithExpiry()
    const getServiceUrl = vi.fn(() => ({ url: 'https://example.test/oni/v1' }))
    globalThis.fetch = vi.fn()

    const manager = createServiceTokenManager({
      getServiceUrl,
      razielToken: 'raziel-token',
      readOnlyToken,
    })

    expect(await manager.getServiceToken('oni')).toBe(readOnlyToken)
    expect(fetch).not.toHaveBeenCalled()
  })

  it('re-authenticates the Oni user after an explicit refresh', async () => {
    const getServiceUrl = () => ({ url: 'https://example.test/oni/v1' })
    const firstToken = tokenWithExpiry()
    const secondToken = tokenWithExpiry()
    globalThis.fetch = vi.fn().mockResolvedValueOnce(response(firstToken)).mockResolvedValueOnce(response(secondToken))

    const manager = createServiceTokenManager({
      getServiceUrl,
      oniUserCredentials: { password: 'password', username: 'admin' },
      razielToken: 'raziel-token',
    })

    await manager.getOniUserToken()
    expect(await manager.refreshOniUserToken()).toBe(secondToken)
    expect(fetch).toHaveBeenCalledTimes(2)
  })

  it('re-exchanges a service token after an explicit refresh', async () => {
    const getServiceUrl = () => ({ secret: 'api-key', url: 'https://example.test/anno/v1' })
    const firstToken = tokenWithExpiry()
    const secondToken = tokenWithExpiry()
    globalThis.fetch = vi.fn().mockResolvedValueOnce(response(firstToken)).mockResolvedValueOnce(response(secondToken))

    const manager = createServiceTokenManager({ getServiceUrl, razielToken: 'raziel-token' })

    await manager.getServiceToken('annosaurus')
    expect(await manager.refreshServiceToken('annosaurus')).toBe(secondToken)
    expect(fetch).toHaveBeenCalledTimes(2)
  })

  it('clears cached service tokens for logout', async () => {
    const getServiceUrl = () => ({ secret: 'api-key', url: 'https://example.test/anno/v1' })
    const firstToken = tokenWithExpiry()
    const secondToken = tokenWithExpiry()
    globalThis.fetch = vi.fn().mockResolvedValueOnce(response(firstToken)).mockResolvedValueOnce(response(secondToken))

    const manager = createServiceTokenManager({ getServiceUrl, razielToken: 'raziel-token' })

    await manager.getServiceToken('annosaurus')
    manager.clearServiceTokens()

    expect(await manager.getServiceToken('annosaurus')).toBe(secondToken)
    expect(fetch).toHaveBeenCalledTimes(2)
  })
})
