import { decodeJwt } from "jose"

import { obfuscate } from "@/lib/auth/obfuscate"
import { authLogin } from "@/lib/services/oni"
import { endpoints } from "@/lib/services/config"

import auth from "@/lib/store/auth"

import { extract } from "@/lib/auth/obfuscate"

const initialPanel = "concepts"

const login = async (_prevState, formData) => {
  const configUrl = formData.get("configUrl")

  const { error: configError } = await endpoints(configUrl)

  if (!!configError) {
    return { configError }
  }

  const username = formData.get("username")
  const password = formData.get("password")

  const { error: authError, _token } = await authLogin(username, password)

  if (!!authError) {
    // return { authError }
  }

  const token =
    "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwOi8vd3d3Lm1iYXJpLm9yZyIsImlhdCI6MTcyNjg2MjcwNywiZXhwIjoxNzI2OTQ5MTA3LCJzdWIiOiIxIiwibmFtZSI6ImFkbWluIiwicm9sZSI6IkFkbWluIn0.tRzIl5fNre02LMM3BGuVHfiF4LacKFVDxkURbb3vzRdtw-p7IuTcVeVW_UC7I3xK74cQwZUtkdOFJnj6atc3vg"

  const { role } = decodeJwt(token)

  const user = {
    panel: initialPanel,
    role,
    username,
  }

  const refresh = await obfuscate(password)

  auth.set({
    token,
    refresh,
  })

  return { user }
}

export default login
