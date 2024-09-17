import { decodeJwt } from "jose"

import { setAuth } from "@/lib/auth/user"
import { authUser } from "@/lib/services/oni"
import { endpoints } from "@/lib/services/config"

const initialPanel = "concepts"

const login = async (_prevState, formData) => {
  const configUrl = formData.get("configUrl")

  const { error: configError } = await endpoints(configUrl)

  if (!!configError) {
    return { configError }
  }

  const username = formData.get("username")
  const password = formData.get("password")

  const { error: authError, token } = await authUser(username, password)

  if (!!authError) {
    return { authError }
  }

  const { role } = decodeJwt(token)

  const user = {
    name: username,
    panel: initialPanel,
    role,
    token,
  }

  await setAuth(user)

  return { user }
}

export default login
