import { getToken, isTokenExpired, setToken } from "./accessToken"

// const server = "http://localhost:8083"
const loginUrl = "/v1/auth/login"

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

export const login = async (username, password) => {
  try {
    const loginParams = params(username, password)

    const response = await fetch(loginUrl, loginParams)

    if (response.statusText !== "OK") {
      return { error: response.statusText }
    }

    const { access_token: accessToken } = await response.json()
    setToken(accessToken)

    return { status: "ok" }
  } catch (error) {
    return { error: error.message }
  }
}

export const isLoggedIn = () => {
  const token = getToken()

  return !!token && isTokenExpired(token)
}
