import { endpointUrl } from "@/lib/services/endpoint"

const pathUrl = async path => {
  const oniUrl = await endpointUrl("oni")

  if (!!oniUrl.error) {
    return oniUrl
  }

  const url = `${oniUrl.urll}/${path}`
  const proxyPath = `/v1/${path}`

  console.log(`Ignoring loginUrl ${url} and using proxy path ${proxyPath}`)

  return { url: proxyPath }
}

export default pathUrl
