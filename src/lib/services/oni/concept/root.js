import conceptUrl from "./conceptUrl"

const fetchRoot = async config => {
  const { error, url } = conceptUrl(config, "query/root")
  if (error) {
    return { error }
  }

  const params = {
    headers: {
      Accept: "application/json",
    },
  }

  const response = await fetch(url, params)
  const payload = await response.json()

  if (response.status !== 200) {
    return { error: payload.message }
  }

  return { root: payload }
}

export default fetchRoot
