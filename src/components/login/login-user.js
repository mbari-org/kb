const loginUser = async (_prevState, formData) => {
  const user = formData.get("user")
  const password = formData.get("password")
  if (user === "admin" && password === "admin") {
    return { success: true }
  }
  return {
    error: "Login invalid",
  }
  // try {
  //   await fetch("/user", {
  //     method: "POST",
  //     body: JSON.stringify({ name: formData.get("name") }),
  //   })
  // } catch (err) {
  //   return {
  //     success: false,
  //     message: err.message,
  //   }
  // }
}

export default loginUser
