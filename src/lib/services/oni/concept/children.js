import conceptUrl from "./conceptUrl"

const fetchChildren = async (taxonomy, name) => {
  const encodedName = encodeURIComponent(name)
  const { error, url } = conceptUrl(taxonomy.config, `children/${encodedName}`)
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

  return { children: payload }
}

export default fetchChildren
