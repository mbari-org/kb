import { decodeJwt } from "jose"

import { setAuth } from "@/lib/auth/user"
import { authUser } from "@/lib/services/oni"

const initialPanel = "concepts"

const login = async (_prevState, formData) => {
  const username = formData.get("username")
  const password = formData.get("password")

  const userAuth = await authUser(username, password)

  if (!!userAuth.error) {
    return userAuth
  }

  const { role } = decodeJwt(userAuth.token)

  const user = {
    name: username,
    panel: initialPanel,
    role: role,
    token: userAuth.token,
  }

  await setAuth(user)

  return { user: user }
}

export default login
