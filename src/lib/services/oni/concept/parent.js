import conceptUrl from "./conceptUrl"

const getParent = async (config, name) => {
  const encodedName = encodeURIComponent(name)
  const { error, url } = conceptUrl(config, `parent/${encodedName}`)
  if (!!error) {
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

  return { parent: payload }
}

export default getParent
