import { serviceUrl } from "@/lib/services/config"

const authLogin = async (username, password) => {
  try {
    const { error, url: authUrl } = await serviceUrl("oni", "auth/login")
    if (!!error) {
      return { error }
    }

    const authParams = params(username, password)

    const response = await fetch(authUrl, authParams)

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
    // mode: "cors",
  }
}

const basicAuth = (username, password) => {
  const credentials = btoa(`${username}:${password}`)
  return `Basic ${credentials}`
}

const headers = auth => ({
  Accept: "application/json",
  Authorization: `${auth}`,
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

export default authLogin
