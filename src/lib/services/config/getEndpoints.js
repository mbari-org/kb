const USE_M3_LOCAL = import.meta.env.VITE_M3_LOCAL ?? false

const getEndpoints = async url => {
  try {
    // This allows the user's input for config server URL to be slashed or slashless
    const slashlessUrl = url.replace(/\/+$/, '')
    const configPath = `${slashlessUrl}/endpoints`

    const response = await fetch(configPath, {
      method: 'GET',
      mode: 'cors',
    })
    if (response.status !== 200) {
      return { error: `Config service: ${response.statusText}` }
    }

    const endpoints = await response.json()

    if (USE_M3_LOCAL) {
      endpoints.forEach(endpoint => {
        const urlObj = new URL(endpoint.url)
        urlObj.hostname = 'localhost'
        endpoint.url = urlObj.toString()
      })
    }

    return { endpoints }
  } catch {
    return { error: 'Config service: Failed access', url }
  }
}

export default getEndpoints
