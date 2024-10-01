import { conceptUrl } from "./util"

const getRoot = async taxonomy => {
  const { error, url } = conceptUrl(taxonomy, "query/root")
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

  return { root: payload }
}

export { getRoot }
