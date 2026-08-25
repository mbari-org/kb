import { beforeEach, describe, expect, it, vi } from 'vitest'

import validateConfigUrl from '@/lib/services/config/validateConfigUrl'

const response = (status, statusText = '') => ({ status, statusText })

describe('validateConfigUrl', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('validates a custom Config Service URL directly', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(response(200))

    await expect(validateConfigUrl('http://wtf.com')).resolves.toEqual({})

    expect(fetch).toHaveBeenCalledWith('http://wtf.com/health', {
      method: 'GET',
      mode: 'cors',
    })
  })

  it('reports an unavailable Config Service before login', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(response(404, 'Not Found'))

    await expect(validateConfigUrl('http://wtf.com')).resolves.toEqual({
      error: 'Config service: 404 Not Found',
    })
  })

  it('uses the local proxy for the HTTPS loopback Config Service', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(response(200))

    await validateConfigUrl('https://localhost/config')

    expect(fetch).toHaveBeenCalledWith(`${globalThis.location.origin}/config/health`, {
      method: 'GET',
      mode: 'cors',
    })
  })

  it('adds the local Config Service context when only the HTTPS host is entered', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(response(200))

    await validateConfigUrl('https://localhost')

    expect(fetch).toHaveBeenCalledWith(`${globalThis.location.origin}/config/health`, {
      method: 'GET',
      mode: 'cors',
    })
  })

  it('uses the local proxy for an HTTP loopback host during development', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(response(200))

    await validateConfigUrl('http://localhost')
    expect(fetch).toHaveBeenCalledWith(`${globalThis.location.origin}/config/health`, {
      method: 'GET',
      mode: 'cors',
    })
  })
})
