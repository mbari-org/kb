import { endpoints } from "./endpoints"

const serviceNames = ["annosauras", "oni"]

const serviceUrl = (serviceName, path) => {
  if (!serviceNames.includes(serviceName)) {
    return { error: `Unknown service: ${serviceName}` }
  }
  const { endpoints: serviceEndpoints } = endpoints()

  const serviceEndpoint = serviceEndpoints.get(serviceName)

  if (!serviceEndpoint) {
    return { error: `No endpoint info for service: ${serviceName}` }
  }
  const url = `${serviceEndpoint.url}/${path}`

  return { url }
}

export default serviceUrl
