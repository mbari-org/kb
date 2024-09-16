// const raziel = "http://localhost:8400"

const raziel = ""
const path = "/config/endpoints"

const serviceNames = ["annosauras", "oni"]

const endpoints = async () => {
  endpoints.error = null
  if (endpoints.services === null) {
    const response = await fetch(`${raziel}${path}`)

    if (response.status !== 200) {
      endpoints.error = `Service registry unavailable: ${response.statusText}`
    } else {
      const endpointArray = await response.json()
      endpoints.services = endpointArray.reduce((acc, obj) => {
        acc.set(obj.name, obj)
        return acc
      }, new Map())
    }
  }
}
endpoints.services = null

const endpointUrl = async service => {
  if (!serviceNames.includes(service)) {
    return { error: `Unknown service: ${service}` }
  }

  await endpoints()

  if (!!endpoints.error) {
    return { error: endpoint.error }
  }

  const endpoint = endpoints.services.get(service)

  if (!endpoint) {
    return { error: `No endpoint info for service: ${service}` }
  }

  return endpoint.url
}

export { endpointUrl }
