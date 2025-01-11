import { jwtDecode } from "jwt-decode"

const isTokenValid = ({ token }) => {
  if (!token) {
    return false
  }

  try {
    const decodedToken = jwtDecode(token)
    const currentTime = Date.now() / 1000
    return currentTime < decodedToken.exp * 1000
  } catch {
    return false
  }
}

export default isTokenValid
