import { endpoint } from "./endpoint"

const serviceUrl = async (service, path) => {
  const { endpoint: serviceEndpoint, error: serviceError } = await endpoint(
    service
  )

  if (!!serviceError) {
    return { error: serviceError }
  }

  const url = `${serviceEndpoint.url}/${path}`
  const proxyPath = `/v1/${path}`

  console.log(`Ignoring loginUrl ${url} and using proxy path ${proxyPath}`)

  return { url: proxyPath }
}

export default serviceUrl
