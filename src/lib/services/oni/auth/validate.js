import { decodeJwt } from "jose"

const validate = auth => {
  if (!auth) {
    return false
  }

  const { role: someRole, token, username: someUsername } = auth
  if (!token) {
    return false
  }

  const { role: authRole, name: authUsername } = decodeJwt(token)
  if (someRole !== authRole || someUsername !== authUsername) {
    return false
  }

  return true
}

export default validate
