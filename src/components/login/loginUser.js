import { login } from "@/lib/auth/login"

const loginUser = async (prevState, formData) => {
  const username = formData.get("username")
  const password = formData.get("password")

  return login(username, password)
}

export default loginUser
