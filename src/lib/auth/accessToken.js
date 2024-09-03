import { jwtDecode } from "jwt-decode"

const storageKey = "accessToken"

export const setAccessToken = accessToken =>
  localStorage.setItem(storageKey, accessToken)

export const getAccessToken = () => localStorage.getItem(storageKey)

export const isExpired = () => {
  try {
    const accessToken = getAccessToken()
    const decodedToken = jwtDecode(accessToken)
    const currentTime = Date.now() / 1000
    return decodedToken.exp * 1000 > currentTime
  } catch (error) {
    return false
  }
}
