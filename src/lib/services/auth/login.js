import { genRefresh } from '@/lib/auth/refreshKey'
import { createError } from '@/lib/errors'

import authUrl from './authUrl'


const loginReadOnly = async () => {
  const refresh = await genRefresh('readonly')

  // There is no reason to refresh a ReadOnly role so the dummy token has an expiration in 2222
  // cSpell:ignore eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9
  const token =
    'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwOi8vd3d3Lm1iYXJpLm9yZyIsImlhdCI6MTU3Nzg3NDYzMywiZXhwIjo3OTUyMzgwMjE2LCJzdWIiOiIyMzgiLCJuYW1lIjoicmVhZG9ubHkiLCJyb2xlIjoiUmVhZE9ubHkifQ.8zHQftSuItJDnkpVcd6VJEI1t26z14h3tFexZaB1UR2ju0oLldkWoWpTmJE3PwGL6aPFHODChJpsFFzi-Qui5A'

  return {
    auth: {
      refresh,
      token,
    },
  }
}

const loginUser = async (config, username, password) => {
  const { error, url: loginUrl } = authUrl(config)
  if (error) {
    return { error: createError('Auth URL Error', error.message || 'Failed to get auth URL', { config }) }
  }

  try {
    const loginParams = params(username, password)
    const loginResponse = await fetch(loginUrl, loginParams)

    if (loginResponse.status !== 200) {
      return {
        error: createError(
          'Login Failed',
          loginResponse.status === 401 ? 'Invalid username or password' : `Login failed: ${loginResponse.statusText}`,
          { status: loginResponse.status, username }
        ),
      }
    }

    const { access_token: token, accessToken } = await loginResponse.json()
    const razielToken = token || accessToken
    if (!razielToken) {
      return {
        error: createError('Login Failed', 'Authentication response missing token', { username }),
      }
    }
    const refresh = await genRefresh(password)

    const auth = {
      refresh,
      token: razielToken,
    }

    return { auth }
  } catch (error) {
    return {
      error: createError(
        'Login Error',
        error.message === 'Failed to fetch' ? 'Failed to connect to authentication service' : error.message,
        { username },
        error
      ),
    }
  }
}

const params = (username, password) => {
  const auth = basicAuth(username, password)
  return {
    headers: headers(auth),
    method: 'POST',
  }
}

const basicAuth = (username, password) => {
  const credentials = btoa(`${username}:${password}`)
  return `Basic ${credentials}`
}

const headers = auth => ({
  Accept: 'application/json',
  Authorization: `${auth}`,
})

export { loginReadOnly, loginUser }
