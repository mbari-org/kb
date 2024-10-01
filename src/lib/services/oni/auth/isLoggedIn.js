import authStore from "@/lib/store/auth"

const isLoggedIn = () => {
  const storedAuth = authStore.get()
  if (storedAuth === null) {
    return false
  }

  const { role, token, username } = storedAuth
  if (!token) {
    return false
  }

  const { role: authRole, name: authUsername } = decodeJwt(token)
  return authRole === role && authUsername === username
}

export default isLoggedIn
