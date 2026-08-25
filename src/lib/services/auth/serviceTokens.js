import { jwtDecode } from 'jwt-decode'

const TOKEN_EXPIRY_BUFFER_SECONDS = 30

const tokenIsValid = token => {
  try {
    const { exp } = jwtDecode(token)
    return !exp || Date.now() / 1000 < exp - TOKEN_EXPIRY_BUFFER_SECONDS
  } catch {
    return false
  }
}

const createServiceTokenManager = ({
  getServiceUrl,
  oniUserCredentials: initialOniUserCredentials,
  razielToken,
  readOnlyToken,
}) => {
  const serviceTokens = new Map()
  const pendingExchanges = new Map()
  let oniUserCredentials = initialOniUserCredentials
  let oniUserToken
  let pendingOniUserExchange

  const exchangeServiceToken = async service => {
    const { error, secret, url } = getServiceUrl(service)
    if (error) throw new Error(error)
    if (!secret) throw new Error(`No API key for service: ${service}`)

    const response = await fetch(`${url}/auth`, {
      headers: {
        Accept: 'application/json',
        Authorization: `APIKEY ${secret}`,
      },
      method: 'POST',
    })

    if (response.status !== 200) {
      throw new Error(`Authentication failed for ${service}: ${response.statusText || response.status}`)
    }

    const { access_token: token, accessToken } = await response.json()
    const serviceToken = token || accessToken
    if (!serviceToken) throw new Error(`Authentication response missing token for ${service}`)

    serviceTokens.set(service, serviceToken)
    return serviceToken
  }

  const getServiceToken = async service => {
    if (service === 'raziel') return razielToken
    if (readOnlyToken) return readOnlyToken

    const token = serviceTokens.get(service)
    if (token && tokenIsValid(token)) return token
    const pendingExchange = pendingExchanges.get(service)
    if (pendingExchange) return pendingExchange

    const exchange = exchangeServiceToken(service).finally(() => {
      pendingExchanges.delete(service)
    })
    pendingExchanges.set(service, exchange)
    return exchange
  }
  const exchangeOniUserToken = async () => {
    if (!oniUserCredentials) throw new Error('No Oni user credentials available')

    const { error, url } = getServiceUrl('oni')
    if (error) throw new Error(error)

    const response = await fetch(`${url}/auth/login`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Basic ${btoa(`${oniUserCredentials.username}:${oniUserCredentials.password}`)}`,
      },
      method: 'POST',
    })

    if (response.status !== 200) {
      throw new Error(`Authentication failed for oni user: ${response.statusText || response.status}`)
    }

    const { access_token: token, accessToken } = await response.json()
    oniUserToken = token || accessToken
    if (!oniUserToken) throw new Error('Authentication response missing token for oni user')
    return oniUserToken
  }

  const getOniUserToken = async () => {
    if (oniUserToken && tokenIsValid(oniUserToken)) return oniUserToken
    if (pendingOniUserExchange) return pendingOniUserExchange

    pendingOniUserExchange = exchangeOniUserToken().finally(() => {
      pendingOniUserExchange = undefined
    })
    return pendingOniUserExchange
  }

  const refreshServiceToken = async service => {
    if (service === 'raziel') return razielToken
    serviceTokens.delete(service)
    return getServiceToken(service)
  }
  const refreshOniUserToken = async () => {
    oniUserToken = undefined
    return getOniUserToken()
  }

  const clearServiceTokens = () => {
    serviceTokens.clear()
    pendingExchanges.clear()
    oniUserCredentials = undefined
    oniUserToken = undefined
    pendingOniUserExchange = undefined
  }

  return {
    clearServiceTokens,
    getServiceToken,
    getOniUserToken,
    refreshOniUserToken,
    refreshServiceToken,
  }
}

export default createServiceTokenManager
