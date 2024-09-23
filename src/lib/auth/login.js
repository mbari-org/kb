import { decodeJwt } from "jose"
import _ from "lodash"

import { obfuscate } from "@/lib/auth/obfuscate"
import { authLogin } from "@/lib/services/oni"
import { endpoints } from "@/lib/services/config"

import appUser from "@/lib/store/appUser"
import auth from "@/lib/store/auth"
import configUrl from "@/lib/store/configUrl"

const initialPanel = "concepts"

const login = async (_prevState, formData) => {
  const username = formData.get("username")
  const password = formData.get("password")

  const { error, _token } = await authLogin(username, password)

  if (!!error) {
    // return { error }
  }

  const token =
    "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwOi8vd3d3Lm1iYXJpLm9yZyIsImlhdCI6MTcyNjg2MjcwNywiZXhwIjoxNzI2OTQ5MTA3LCJzdWIiOiIxIiwibmFtZSI6ImFkbWluIiwicm9sZSI6IkFkbWluIn0.tRzIl5fNre02LMM3BGuVHfiF4LacKFVDxkURbb3vzRdtw-p7IuTcVeVW_UC7I3xK74cQwZUtkdOFJnj6atc3vg"

  const { role } = decodeJwt(token)

  const user = {
    panel: initialPanel,
    role,
    username,
  }

  appUser.set(user)

  const refresh = await obfuscate(password)

  auth.set({
    token,
    refresh,
  })

  return { user }
}

const loggedInUser = () => {
  const user = appUser.get()
  if (!user) {
    return clearLoggedIn()
  }

  const { token } = auth.get()
  if (!token) {
    return clearLoggedIn()
  }

  const { role, username } = decodeJwt(token)
  if (user.name !== username || user.role !== role) {
    return clearLoggedIn()
  }

  return user
}

const clearLoggedIn = () => {
  appUser.clear()
  auth.clear()
  return {}
}

const isLoggedIn = () => {
  const user = appUser.get()
  if (!user || _.isEmpty(user)) {
    return false
  }

  const { token } = auth.get()
  if (!token) {
    return false
  }

  const { role, username } = decodeJwt(token)
  return user.name === username || user.role === role
}

export { login, loggedInUser, isLoggedIn }
