import login from "@/lib/auth/login"

const loginUser = async (_prevState, formData) => {
  const username = formData.get("username")
  const password = formData.get("password")

  login(username, password)
}

export default loginUser
