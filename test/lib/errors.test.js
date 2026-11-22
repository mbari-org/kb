import { describe, expect, it } from 'vitest'

import { isAmbiguousWriteError } from '@/lib/errors'

describe('isAmbiguousWriteError', () => {
  it.each([500, 502, 503, 504])('treats a %i as outcome unknown', status => {
    expect(isAmbiguousWriteError({ status })).toBe(true)
  })

  it('treats a network failure with no status as outcome unknown', () => {
    expect(isAmbiguousWriteError({ status: undefined })).toBe(true)
  })

  it.each([400, 401, 403, 404])('treats a %i as not applied', status => {
    expect(isAmbiguousWriteError({ status })).toBe(false)
  })
})
