import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/auth/refreshKey', () => ({
  genRefresh: vi.fn().mockResolvedValue('encrypted-refresh'),
}))

import { loginUser } from '@/lib/services/auth/login'
import authStore from '@/lib/local/store/authStore'

const response = (status, body, statusText = '') => ({
  json: vi.fn().mockResolvedValue(body),
  status,
  statusText,
})

describe('loginUser', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    authStore.remove()
  })

  it('authenticates against Raziel without persisting until session processing completes', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(response(200, { access_token: 'raziel-token' }))

    const result = await loginUser({ url: 'https://localhost/config' }, 'admin', 'password')

    expect(result).toEqual({
      auth: {
        refresh: 'encrypted-refresh',
        token: 'raziel-token',
      },
    })
    expect(fetch).toHaveBeenCalledWith(
      `${globalThis.location.origin}/config/auth`,
      expect.objectContaining({
        headers: {
          Accept: 'application/json',
          Authorization: `Basic ${btoa('admin:password')}`,
        },
        method: 'POST',
      })
    )
    expect(authStore.get()).toBeNull()
  })

  it('returns a useful error for invalid credentials', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(response(401, {}, 'Unauthorized'))

    const result = await loginUser({ url: 'https://localhost/config' }, 'admin', 'bad-password')

    expect(result.error).toMatchObject({
      message: 'Invalid username or password',
      title: 'Login Failed',
    })
  })

  it('uses a custom config service URL in development', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(response(200, { access_token: 'raziel-token' }))

    await loginUser({ url: 'http://wtf.com/config' }, 'admin', 'password')

    expect(fetch).toHaveBeenCalledWith(
      'http://wtf.com/config/auth',
      expect.objectContaining({
        headers: {
          Accept: 'application/json',
          Authorization: `Basic ${btoa('admin:password')}`,
        },
        method: 'POST',
      })
    )
  })

  it('adds the local Config Service context when only the host is entered', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(response(200, { access_token: 'raziel-token' }))

    await loginUser({ url: 'https://localhost' }, 'admin', 'password')

    expect(fetch).toHaveBeenCalledWith(
      `${globalThis.location.origin}/config/auth`,
      expect.objectContaining({
        headers: {
          Accept: 'application/json',
          Authorization: `Basic ${btoa('admin:password')}`,
        },
        method: 'POST',
      })
    )
  })
})
