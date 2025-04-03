const apiUrl = (config, service, path) => {
  const { error, url } = config.getServiceUrl(service)
  if (error) {
    throw Error(error)
  }
  const resourcePath = path.map(piece => encodeURIComponent(piece)).join('/')
  return `${url}/${resourcePath}`
}

export default apiUrl
