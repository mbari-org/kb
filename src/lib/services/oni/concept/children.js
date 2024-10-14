import conceptUrl from "./conceptUrl"

const fetchChildren = async (taxonomy, conceptName) => {
  const encodedName = encodeURIComponent(conceptName)
  const { error, url } = conceptUrl(taxonomy.config, `children/${encodedName}`)
  if (error) {
    return { error }
  }

  const params = {
    headers: {
      Accept: "application/json",
    },
  }

  try {
    const response = await fetch(url, params)
    const payload = await response.json()

    if (response.status !== 200) {
      return { error: payload.message }
    }

    return { children: payload }
  } catch (error) {
    console.error(`Error fetching concept children '${conceptName}':`, error)
    return { error: error.message || "An unknown error occurred" }
  }
}

export default fetchChildren
