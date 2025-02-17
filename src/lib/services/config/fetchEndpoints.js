const fetchEndpoints = async url => {
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

    return { endpoints: await response.json() }
  } catch {
    return { error: `Config service: Failed access`, url }
  }
}

export default fetchEndpoints
