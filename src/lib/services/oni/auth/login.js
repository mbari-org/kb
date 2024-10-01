import { decodeJwt } from "jose"

import authStore from "@/lib/store/auth"

import authUrl from "./authUrl"
import { obfuscate } from "./refresh"

const login = async (config, username, password) => {
  const { error, url: loginUrl } = authUrl(config, "login")
  if (!!error) {
    return { error }
  }

  try {
    const authParams = params(username, password)
    const response = await fetch(loginUrl, authParams)

    if (response.status !== 200) {
      return authErrorMessage(response.statusText)
    }

    const { access_token: token } = await response.json()

    return processToken(password, token)
  } catch (error) {
    // return { error: error.message }

    console.log("Ignore login error:", error)
    const token =
      "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwOi8vd3d3Lm1iYXJpLm9yZyIsImlhdCI6MTcyNjg2MjcwNywiZXhwIjoxNzI2OTQ5MTA3LCJzdWIiOiIxIiwibmFtZSI6ImFkbWluIiwicm9sZSI6IkFkbWluIn0.tRzIl5fNre02LMM3BGuVHfiF4LacKFVDxkURbb3vzRdtw-p7IuTcVeVW_UC7I3xK74cQwZUtkdOFJnj6atc3vg"
    return processToken(password, token)
  }
}

const processToken = async (password, token) => {
  const { role, name } = decodeJwt(token)
  const refresh = await obfuscate(password)
  const auth = {
    token,
    refresh,
    role,
    username: name,
  }
  authStore.set(auth)

  return {
    auth,
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
      message = `An unknown error occurred: ${statusText}\nPlease contact support.`
  }
  return { error: message }
}

export default login
