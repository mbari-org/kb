import { serviceUrl } from "@/lib/services/config"

const authUser = async (username, password) => {
  try {
    const authUrl = await serviceUrl("oni", "auth/login")
    if (!!authUrl.error) {
      return authUrl
    }

    const authParams = params(username, password)

    const response = await fetch(authUrl.url, authParams)

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
