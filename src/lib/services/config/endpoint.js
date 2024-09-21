import endpoints from "./endpoints"

const serviceNames = ["annosauras", "oni"]

const endpoint = async service => {
  if (!serviceNames.includes(service)) {
    return { error: `Unknown service: ${service}` }
  }
  const { endpoints: serviceEndpoints } = await endpoints()

  const serviceEndpoint = serviceEndpoints.get(service)

  if (!serviceEndpoint) {
    return { error: `No endpoint info for service: ${service}` }
  }

  return { endpoint: serviceEndpoint }
}

export { endpoint }
