const conceptUrl = (taxonomy, path) => {
  const { error, url } = taxonomy._config_.getServiceUrl("oni")
  return !!error ? { error } : { url: `${url}/concept/${path}` }
}

export { conceptUrl }
