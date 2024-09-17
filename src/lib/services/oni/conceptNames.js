import { serviceUrl } from "@/lib/services/config"

const conceptNamesPath = "names"

// CxNote Currently not using pagination. The payload structure is:
//   { content: namesArray, limit: 10000, offset: 0}
const conceptNames = async () => {
  const namesUrl = await serviceUrl("oni", conceptNamesPath)
  if (!!namesUrl.error) {
    return namesUrl
  }

  const response = await fetch(namesUrl.url, namesParams)
  const payload = await response.json()

  // CxTBD Is this right?
  if (response.status !== 200) {
    return { error: payload.message }
  }

  const { content: conceptNames } = payload

  return conceptNames
}

const namesParams = () => {
  return {
    headers: headers(),
  }
}

const headers = () => ({
  Accept: "application/json",
})

export default conceptNames
