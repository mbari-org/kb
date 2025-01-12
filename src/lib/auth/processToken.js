import { jwtDecode } from "jwt-decode"

const processToken = token => {
  const decodedToken = jwtDecode(token)

  const { exp, role, name } = decodedToken

  const currentTime = Date.now() / 1000
  if (exp * 1000 < currentTime) {
    return { error: "Expired Token" }
  }

  const user = {
    expiry: exp,
    role,
    name,
  }

  return { user }
}

export default processToken
