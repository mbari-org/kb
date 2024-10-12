const authUrl = (config, path) => {
  const { error, url } = config.getServiceUrl("oni")
  return error ? { error } : { url: `${url}/auth/${path}` }
}

export default authUrl
