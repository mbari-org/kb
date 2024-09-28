const createServiceLookup = endpoints => {
  const serviceNames = ["annosaurus", "oni"]

  const serviceEndpoints = endpoints
    .filter(endpoint => serviceNames.includes(endpoint.name))
    .reduce((acc, obj) => {
      acc.set(obj.name, obj)
      return acc
    }, new Map())

  return serviceName => {
    if (!serviceNames.includes(serviceName)) {
      return { error: `Unknown service: ${serviceName}` }
    }
    const serviceEndpoint = serviceEndpoints.get(serviceName)

    if (!serviceEndpoint) {
      return {
        error: `${config.url} has no endpoint info for service: ${serviceName}`,
      }
    }

    return { url: serviceEndpoint.url }
  }
}

export default createServiceLookup
