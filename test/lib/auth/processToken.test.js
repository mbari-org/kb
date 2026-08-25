import { describe, expect, it } from 'vitest'

import processToken from '@/lib/auth/processToken'

const tokenWith = claims => {
  const encodedClaims = btoa(JSON.stringify(claims)).replace(/=+$/, '')
  return `header.${encodedClaims}.signature`
}

describe('processToken', () => {
  it('maps Raziel identity claims while leaving role available for Oni hydration', () => {
    const result = processToken(
      tokenWith({
        affiliation: 'MBARI',
        email: 'admin@example.test',
        exp: Math.floor(Date.now() / 1000) + 3600,
        username: 'admin',
      })
    )

    expect(result).toEqual({
      user: {
        affiliation: 'MBARI',
        email: 'admin@example.test',
        expiry: expect.any(Number),
        name: 'admin',
        role: undefined,
      },
    })
  })

  it('rejects malformed and expired tokens', () => {
    expect(processToken('not-a-jwt')).toEqual({ error: 'Invalid Token' })
    expect(
      processToken(tokenWith({ exp: Math.floor(Date.now() / 1000) - 1, username: 'admin' }))
    ).toEqual({ error: 'Expired Token' })
  })
})
