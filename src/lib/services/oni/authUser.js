import { endpointUrl } from "@/lib/services/endpoint"

const loginPath = "auth/login"

const authUser = async (username, password) => {
  try {
    const oniParams = params(username, password)

    const oniUrl = await endpointUrl("oni")
    if (!!oniUrl.error) {
      return oniUrl
    }

    const loginUrl = `${oniUrl}/${loginPath}`
    const proxyPath = `/v1/${loginPath}`
    console.log(
      `Ignoring loginUrl ${loginUrl} and using proxy path ${proxyPath}`
    )

    const response = await fetch(proxyPath, oniParams)

    if (response.status !== 200) {
      return authErrorMessage(response.statusText)
    }

    const { access_token: accessToken } = await response.json()

    return { token: accessToken }
  } catch (error) {
    return { error: error.message }
  }
}

const params = (username, password) => {
  const auth = basicAuth(username, password)
  return {
    credentials: "include",
    headers: headers(auth),
    method: "POST",
    mode: "cors",
  }
}

const basicAuth = (username, password) => {
  const credentials = btoa(`${username}:${password}`)
  return `Basic ${credentials}`
}

const headers = auth => ({
  Accept: "application/json",
  "Accept-Language": "en-US,en;q=0.5",
  Authorization: `${auth}`,
  "Sec-Fetch-Dest": "empty",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Site": "same-origin",
  Priority: "u=0",
})

const authErrorMessage = statusText => {
  var message
  switch (statusText.toLowerCase()) {
    case "unauthorized":
      message = "Invalid Username/Password"
      break
    case "invalid":
      message = "Invalid Username/Password"
      break
    default:
      message = "An unknown error occurred.\n Please contact support."
  }
  return { error: message }
}

export default authUser
