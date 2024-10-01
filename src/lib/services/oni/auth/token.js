import { jwtDecode } from "jwt-decode"

const isTokenValid = user => {
  if (!user || !user.token) {
    return false
  }

  try {
    const decodedToken = jwtDecode(user.token)
    const currentTime = Date.now() / 1000
    return currentTime < decodedToken.exp * 1000
  } catch (error) {
    return false
  }
}

export { isTokenValid }
