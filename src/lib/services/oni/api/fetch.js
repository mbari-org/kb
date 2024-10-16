const oniResource = (config, path) => {
  const { error, url } = config.getServiceUrl("oni")
  if (error) {
    throw Error(error)
  }
  const resourcePath = path.map(piece => encodeURIComponent(piece)).join("/")
  return `${url}/${resourcePath}`
}

const apiFetch = async (config, path) => {
  const resource = oniResource(config, path)

  const params = {
    headers: {
      Accept: "application/json",
    },
  }

  try {
    const response = await fetch(resource, params)
    const payload = await response.json()
    if (response.status !== 200) {
      throw new Error(payload.message)
    }

    return payload
  } catch (error) {
    console.error(`Error processing ${resource}:`, error)
    throw new Error(`Error processing ${resource}: ${error.message}`)
  }
}

export { apiFetch }
