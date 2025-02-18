import { genRefresh } from '@/lib/auth/refreshKey'
import authStore from '@/lib/store/auth'

import authUrl from './authUrl'

const loginReadOnly = async () => {
  const refresh = await genRefresh('readonly')

  // There is no reason to refresh a ReadOnly role so the token has an expiration in 2222
  // cSpell:ignore eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9
  const token =
    'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwOi8vd3d3Lm1iYXJpLm9yZyIsImlhdCI6MTU3Nzg3NDYzMywiZXhwIjo3OTUyMzgwMjE2LCJzdWIiOiIyMzgiLCJuYW1lIjoicmVhZG9ubHkiLCJyb2xlIjoiUmVhZE9ubHkifQ.8zHQftSuItJDnkpVcd6VJEI1t26z14h3tFexZaB1UR2ju0oLldkWoWpTmJE3PwGL6aPFHODChJpsFFzi-Qui5A'

  const auth = {
    refresh,
    token,
  }
  authStore.set(auth)

  return { auth }
}

const loginUser = async (config, username, password) => {
  const { error, url: loginUrl } = authUrl(config, 'login')
  if (error) {
    return { error }
  }

  try {
    const loginParams = params(username, password)
    const loginResponse = await fetch(loginUrl, loginParams)

    if (loginResponse.status !== 200) {
      return errorMessage(loginResponse.statusText)
    }

    const { access_token: token } = await loginResponse.json()
    const refresh = await genRefresh(password)

    const auth = {
      refresh,
      token,
    }
    authStore.set(auth)

    return { auth }
  } catch (error) {
    return { error: error.message }
  }
}

// const processToken = async (password, token) => {
//   const { role, name } = decodeJwt(token)
//   const refresh = await obfuscate(password)
// const auth = {
//   token,
//   refresh,
//   role,
//   username: name,
// }
// authStore.set(auth)

//   return { auth }
// }

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

const errorMessage = statusText => {
  var message
  switch (statusText.toLowerCase()) {
    case 'unauthorized':
      message = 'Invalid Username/Password'
      break
    case 'invalid':
      message = 'Invalid Username/Password'
      break
    default:
      message = `An unknown error occurred: ${statusText}\nPlease contact support.`
  }
  return { error: message }
}

export { loginReadOnly, loginUser }
