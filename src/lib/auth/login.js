import { decodeJwt } from "jose"

import { obfuscate } from "@/lib/auth/obfuscate"
import authLogin from "@/lib/services/oni/auth/login"

import authStore from "@/lib/store/auth"
import userStore from "@/lib/store/user"

const login = async (getServiceUrl, username, password) => {
  const { error, _token } = await authLogin(getServiceUrl, username, password)

  if (!!error) {
    console.error(`Login error: ${error}`)
    // return { error }
  }

  const token =
    "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwOi8vd3d3Lm1iYXJpLm9yZyIsImlhdCI6MTcyNjg2MjcwNywiZXhwIjoxNzI2OTQ5MTA3LCJzdWIiOiIxIiwibmFtZSI6ImFkbWluIiwicm9sZSI6IkFkbWluIn0.tRzIl5fNre02LMM3BGuVHfiF4LacKFVDxkURbb3vzRdtw-p7IuTcVeVW_UC7I3xK74cQwZUtkdOFJnj6atc3vg"

  const { role } = decodeJwt(token)
  const refresh = await obfuscate(password)

  authStore.set({
    token,
    refresh,
    role,
    username,
  })
}

const logout = () => {
  userStore.clear()
  authStore.clear()
  return null
}

const isLoggedIn = () => {
  const { role, token, username } = authStore.get()
  if (!token) {
    return false
  }

  const { role: authRole, name: authUsername } = decodeJwt(token)
  return authRole === role && authUsername === username
}

export { isLoggedIn, login, logout }
