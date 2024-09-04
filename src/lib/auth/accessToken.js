import { jwtDecode } from "jwt-decode"

const storageKey = "auth:accessToken"

export const setToken = accessToken =>
  localStorage.setItem(storageKey, accessToken)

export const getToken = () => localStorage.getItem(storageKey)

export const isTokenExpired = accessToken => {
  try {
    const decodedToken = jwtDecode(accessToken)
    const currentTime = Date.now() / 1000
    return decodedToken.exp * 1000 > currentTime
  } catch (error) {
    return false
  }
}
