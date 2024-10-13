import conceptUrl from "./conceptUrl"

const fetchNames = async config => {
  const { error, url } = config.getServiceUrl("oni")
  if (error) {
    return { error }
  }
  const namesUrl = `${url}/names`
  const params = {
    headers: {
      Accept: "application/json",
    },
  }

  const response = await fetch(namesUrl, params)
  const payload = await response.json()

  if (response.status !== 200) {
    return { error: payload.message }
  }

  const { content: names } = payload

  return { names }
}

export default fetchNames
