import { useEffect } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { render, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
vi.mock('@/lib/auth/refreshKey', () => ({
  extract: vi.fn().mockResolvedValue({ password: 'password' }),
}))

import ConfigContext from '@/contexts/config/ConfigContext'
import useProcessAuth from '@/contexts/user/lib/useProcessAuth'

const tokenWith = claims => {
  const encodedClaims = btoa(JSON.stringify(claims)).replace(/=+$/, '')
  return `header.${encodedClaims}.signature`
}

const response = (status, body) => ({
  json: vi.fn().mockResolvedValue(body),
  status,
  statusText: 'OK',
})

describe('useProcessAuth', () => {
  it('hydrates role and profile from Oni after authenticating the Raziel session', async () => {
    const setUser = vi.fn()
    const onResult = vi.fn()
    const authenticateConfig = vi.fn().mockResolvedValue({
      config: {
        getServiceToken: vi.fn().mockResolvedValue('oni-token'),
        getServiceUrl: vi.fn().mockReturnValue({ url: 'https://example.test/kb/v1' }),
        refreshServiceToken: vi.fn(),
      },
    })
    globalThis.fetch = vi.fn().mockResolvedValue(
      response(200, {
        email: 'admin@example.test',
        firstName: 'Admin',
        password: 'encrypted-password',
        role: 'Admin',
        username: 'admin',
      })
    )
    const auth = {
      refresh: 'encrypted-refresh',
      token: tokenWith({
        affiliation: 'MBARI',
        email: 'admin@example.test',
        exp: Math.floor(Date.now() / 1000) + 3600,
        username: 'admin',
      }),
    }

    const Probe = () => {
      const processAuth = useProcessAuth(setUser)
      useEffect(() => {
        processAuth(auth).then(onResult)
      }, [processAuth])
      return null
    }

    render(
      <MemoryRouter>
        <ConfigContext.Provider value={{ authenticateConfig, clearAuthenticatedConfig: vi.fn() }}>
          <Probe />
        </ConfigContext.Provider>
      </MemoryRouter>
    )

    await waitFor(() => expect(onResult).toHaveBeenCalled())

    expect(setUser).toHaveBeenCalledWith({
      affiliation: 'MBARI',
      email: 'admin@example.test',
      expiry: expect.any(Number),
      firstName: 'Admin',
      name: 'admin',
      role: 'Admin',
      username: 'admin',
    })
    expect(onResult).toHaveBeenCalledWith({ auth })
    expect(authenticateConfig).toHaveBeenCalledWith(auth, {
      password: 'password',
      username: 'admin',
    })
    expect(fetch).toHaveBeenCalledWith(
      'https://example.test/kb/v1/users/admin',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer oni-token',
        }),
      })
    )
  })

  it('processes the read-only token without password recovery or profile lookup', async () => {
    const setUser = vi.fn()
    const onResult = vi.fn()
    globalThis.fetch = vi.fn()
    const authenticateConfig = vi.fn().mockResolvedValue({
      config: {
        getServiceToken: vi.fn(),
        getServiceUrl: vi.fn().mockReturnValue({ url: 'https://example.test/kb/v1' }),
        refreshServiceToken: vi.fn(),
      },
    })
    const auth = {
      refresh: 'read-only-refresh',
      token: tokenWith({
        exp: Math.floor(Date.now() / 1000) + 3600,
        name: 'readonly',
        role: 'ReadOnly',
      }),
    }

    const Probe = () => {
      const processAuth = useProcessAuth(setUser)
      useEffect(() => {
        processAuth(auth).then(onResult)
      }, [processAuth])
      return null
    }

    render(
      <MemoryRouter>
        <ConfigContext.Provider value={{ authenticateConfig, clearAuthenticatedConfig: vi.fn() }}>
          <Probe />
        </ConfigContext.Provider>
      </MemoryRouter>
    )

    await waitFor(() => expect(onResult).toHaveBeenCalled())

    expect(setUser).toHaveBeenCalledWith({
      expiry: expect.any(Number),
      name: 'readonly',
      role: 'ReadOnly',
    })
    expect(onResult).toHaveBeenCalledWith({ auth })
    expect(authenticateConfig).toHaveBeenCalledWith(auth, undefined, true)
    expect(fetch).not.toHaveBeenCalled()
  })
})
