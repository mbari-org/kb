const EMPTY_CONFIG = {
  endpoints: null,
  url: null,
}

let config = EMPTY_CONFIG

const fetchEndpoints = async url => {
  config = EMPTY_CONFIG

  const { endpoints, error } = await fetchConfig(url)
  if (error) {
    return { error, url }
  }
  config = {
    endpoints,
    url,
  }

  return config
}

const fetchConfig = async url => {
  try {
    // This allows the user's input for config server URL to be slashed or slashless
    const slashlessUrl = url.replace(/\/+$/, "")
    const configPath = `${slashlessUrl}/endpoints`

    const response = await fetch(configPath, {
      method: "GET",
      mode: "cors",
    })
    if (response.status !== 200) {
      return { error: `Config service: ${response.statusText}` }
    }

    const endpointsJson = await response.json()
    const endpoints = endpointsJson.reduce((acc, obj) => {
      acc.set(obj.name, obj)
      return acc
    }, new Map())

    return { endpoints }
  } catch {
    return { error: `Config service: Failed access`, url }
  }
}

const endpoints = () => config

export { endpoints, fetchEndpoints }
