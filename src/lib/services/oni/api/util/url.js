const oniUrl = (config, path) => {
  const { error, url } = config.getServiceUrl("oni")
  if (error) {
    throw Error(error)
  }
  const resourcePath = path.map(piece => encodeURIComponent(piece)).join("/")
  return `${url}/${resourcePath}`
}

export default oniUrl
