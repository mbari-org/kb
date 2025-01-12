import { jwtDecode } from "jwt-decode"

import decodeToken from "@/lib/auth/decodeToken"

import authStore from "@/lib/store/auth"

const validateAuth = auth => {
  if (!auth) {
    return false
  }

  const { role: someRole, token, username: someUsername } = auth
  if (!token) {
    return false
  }

  const { error, decoded } = decodeToken(token)
  if (error) {
    return false
  }

  const { role: authRole, name: authUsername } = decoded
  if (someRole !== authRole || someUsername !== authUsername) {
    return false
  }

  return true
}

const validateToken = () => {
  const { token } = authStore.get()

  if (!token) {
    return false
  }

  try {
    const decodedToken = jwtDecode(token)
    const currentTime = Date.now() / 1000

    if (currentTime >= decodedToken.exp * 1000) {
      return false
    }

    return currentTime < decodedToken.exp * 1000
  } catch {
    return false
  }
}

export { validateAuth, validateToken }
