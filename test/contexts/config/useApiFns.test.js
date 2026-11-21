import { describe, expect, it, vi } from 'vitest'
import { renderHook } from '@testing-library/react'

import useApiFns from '@/contexts/config/useApiFns'

const config = { baseUrl: 'https://oni.test' }

const setup = () => {
  const showBoundary = vi.fn()
  const { result } = renderHook(() => useApiFns(config, showBoundary))
  return { apiFns: result.current, showBoundary }
}

describe('useApiFns apiWrite', () => {
  it('resolves to the payload and passes the config to the request', async () => {
    const { apiFns, showBoundary } = setup()
    const writeRequest = vi.fn(async () => ({ payload: { id: 7 }, status: 200 }))

    await expect(apiFns.apiWrite(writeRequest, ['names'])).resolves.toEqual({ id: 7 })
    expect(writeRequest).toHaveBeenCalledWith(config, ['names'])
    expect(showBoundary).not.toHaveBeenCalled()
  })

  it('throws the error with its HTTP status and does not show the boundary', async () => {
    const { apiFns, showBoundary } = setup()
    const writeRequest = vi.fn(async () => ({
      error: { title: 'Server Error', message: 'boom', details: {} },
      status: 500,
    }))

    await expect(apiFns.apiWrite(writeRequest, {})).rejects.toMatchObject({
      title: 'Server Error',
      message: 'boom',
      status: 500,
    })
    expect(showBoundary).not.toHaveBeenCalled()
  })

  it('throws network failures without an HTTP status', async () => {
    const { apiFns } = setup()
    const writeRequest = vi.fn(async () => ({
      error: { title: 'Network Error', message: 'Failed to fetch' },
    }))

    const thrown = await apiFns.apiWrite(writeRequest, {}).catch(error => error)

    expect(thrown).toMatchObject({ title: 'Network Error', message: 'Failed to fetch' })
    expect(thrown.status).toBeUndefined()
  })
})

describe('useApiFns apiPayload', () => {
  it('keeps read errors on the error boundary and resolves without a payload', async () => {
    const { apiFns, showBoundary } = setup()
    const error = { title: 'Server Error', message: 'boom' }
    const readRequest = vi.fn(async () => ({ error, status: 500 }))

    await expect(apiFns.apiPayload(readRequest, {})).resolves.toBeUndefined()
    expect(showBoundary).toHaveBeenCalledWith(error)
  })
})
