import { use } from "react"

import ConfigContext from "@/components/config/ConfigContext"

const conceptNamesPath = "names"

// CxNote Currently not using pagination. The payload structure is:
//   { content: namesArray, limit: 10000, offset: 0}
const conceptNames = async () => {
  const { serviceUrl } = use(ConfigContext)

  const namesUrl = serviceUrl("oni", conceptNamesPath)
  if (!!namesUrl.error) {
    return namesUrl
  }

  const response = await fetch(namesUrl.url, namesParams)
  const payload = await response.json()

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
