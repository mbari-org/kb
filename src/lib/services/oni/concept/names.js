const getNames = async url => {
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

  const { content: names } = payload

  return { names }
}

export { getNames }
