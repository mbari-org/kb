const serviceNames = ["annosauras", "oni"]

const service = async serviceName => {
  if (!serviceNames.includes(service)) {
    return { error: `Unknown service: ${serviceName}` }
  }
  const { endpoints: serviceEndpoints } = await endpoints()

  const serviceEndpoint = serviceEndpoints.get(serviceName)

  if (!serviceEndpoint) {
    return { error: `No endpoint info for service: ${serviceName}` }
  }

  return { endpoint: serviceEndpoint }
}

const serviceUrl = async (serviceName, path) => {
  const { endpoint, error } = await service(serviceName)

  if (!!error) {
    return { error }
  }

  const url = `${endpoint.url}/${path}`

  return { url }
  // const proxyPath = `/v1/${path}`

  // console.log(`Ignoring loginUrl ${url} and using proxy path ${proxyPath}`)

  // return { url: proxyPath }
}

export default serviceUrl
