const createServiceLookup = (endpoints, razielUrl) => {
  const serviceNames = ['annosaurus', 'oni', 'raziel']

  const serviceEndpoints = [{ name: 'raziel', url: razielUrl }, ...endpoints]
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
        error: `no endpoint info for service: ${serviceName}`,
      }
    }

    return {
      secret: serviceEndpoint.secret,
      url: serviceEndpoint.url,
    }
  }
}

export default createServiceLookup
