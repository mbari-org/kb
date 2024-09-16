import { jwtDecode } from "jwt-decode"

const storageKey = "auth:user"

export const getAuth = async () => JSON.parse(localStorage.getItem(storageKey))
export const setAuth = async user =>
  localStorage.setItem(storageKey, JSON.stringify(user))

export const clearAuth = async () => localStorage.removeItem(storageKey)

export const isTokenValid = user => {
  if (!user || !user.token) return false

  try {
    const decodedToken = jwtDecode(user.token)
    const currentTime = Date.now() / 1000
    return currentTime < decodedToken.exp * 1000
  } catch (error) {
    return false
  }
}
