const conceptUrl = (config, path) => {
  const { error, url } = config.getServiceUrl("oni")
  return !!error ? { error } : { url: `${url}/concept/${path}` }
}

export { conceptUrl }
