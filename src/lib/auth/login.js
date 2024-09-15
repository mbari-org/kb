import { setAuth } from "@/lib/auth/user"

// const server = "http://localhost:8083"
const loginUrl = "/v1/auth/login"

const initialPanel = "concepts"

const login = async (prevState, formData) => {
  const username = formData.get("username")
  const password = formData.get("password")

  if (username.trim() == "" || password.trim() == "")
    return { error: "Provide Username and Password" }

  return loginUser(username, password)
}

const loginUser = async (username, password) => {
  try {
    const loginParams = params(username, password)
    const response = await fetch(loginUrl, loginParams)

    const status = response.statusText

    if (status !== "OK") {
      return kbErrorMessage(status)
    }

    const { access_token: accessToken } = await response.json()
    const user = { name: username, panel: initialPanel, token: accessToken }
    await setAuth(user)

    return { user: user }
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

const kbErrorMessage = statusText => {
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

export default login
