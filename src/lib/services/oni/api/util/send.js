import { validateToken } from "@/lib/auth/validate"

const oniSend = async (url, params) => {
  validateToken()

  try {
    const response = await fetch(url, params)
    const payload = await response.json()
    if (response.status === 200) {
      return { payload }
    }
    if (response.status === 401) {
      return errorResponse(
        url,
        errorTitle(response.status),
        "Unauthorized: Invalid token"
      )
    }

    return errorResponse(url, errorTitle(response.status), payload.message)
  } catch (error) {
    return errorResponse(url, "Unknown Error", error.message)
  }
}

const errorTitle = status => {
  switch (status) {
    case 400:
      return "Bad Request"
    case 401:
      return "Unauthorized"
    case 403:
      return "Forbidden"
    case 404:
      return "Not Found"
    case 500:
      return "Internal Server Error"
    default:
      return "Unknown Error"
  }
}

const errorResponse = (url, title, message) => ({
  error: {
    detail: url,
    message,
    title,
    type: "error",
  },
})

export default oniSend
