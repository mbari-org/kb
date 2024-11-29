import { decodeJwt } from "jose"

import authStore from "@/lib/store/auth"

const isAdmin = () => {
  const { token } = authStore.get()

  const { role: authRole } = decodeJwt(token)
  return authRole === "admin"
}

const validateAuth = auth => {
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

export { isAdmin, validateAuth }
