import configUrlStore from "@/lib/store/configUrl"

let cached = {
  endpoints: null,
  url: null,
}

const endpointsConfig = async url => {
  if (!!cached.endpoints) {
    return cached
  }

  const { endpoints, error } = await fetchConfig(url)
  if (error) {
    return { error, url }
  }
  cached = {
    endpoints,
    url,
  }

  return cached
}

const fetchConfig = async url => {
  try {
    // This allows the user's input for config server URL to be slashed or slashless
    const slashlessUrl = url.replace(/\/+$/, "")
    const configPath = `${slashlessUrl}/config/endpoints`

    const response = await fetch(configPath)

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
    return { error: `Config service: Failed access`, url }
  }
}

const endpoints = () => cached

export { endpoints, endpointsConfig }
