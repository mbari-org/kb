import configUrlStore from "@/lib/store/configUrl"

let cached = {
  endpoints: null,
  url: null,
}

const endpoints = async configUrl => {
  if (!configUrl) {
    return cached
  }

  configUrlStore.set(configUrl)

  const { endpoints, error } = await fetchConfig(configUrl)
  if (error) {
    return { error: error }
  }
  cached = {
    endpoints,
    url: configUrl,
  }

  return cached
}

const fetchConfig = async configUrl => {
  try {
    const response = await fetch(configPath(configUrl))

    if (response.status !== 200) {
      return { error: `Config service: ${response.statusText}` }
    } else {
      const endpoints = await response.json()
      const endpointsMap = endpoints.reduce((acc, obj) => {
        acc.set(obj.name, obj)
        return acc
      }, new Map())

      return { endpoints: endpointsMap }
    }
  } catch {
    return { error: `Config service: Failed access` }
  }
}

// This allows the user's input config server URL to be slashed or slashless
const configPath = url => {
  const slashlessUrl = url.replace(/\/+$/, "")
  return `${slashlessUrl}/config/endpoints`
}

export default endpoints
