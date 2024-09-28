const fetchConcept = async (config, name) => {
  const { error, url: oniUrl } = getServiceUrl("oni")
  if (!!error) {
    return { error }
  }

  const conceptUrl = `${oniUrl}/concept/${name}`

  const params = {
    headers: {
      Accept: "application/json",
    },
  }

  const response = await fetch(conceptUrl, params)
  const payload = await response.json()

  if (response.status !== 200) {
    return { error: payload.message }
  }

  const { content: names } = payload

  return { names }
}

export default fetchConceptNames
