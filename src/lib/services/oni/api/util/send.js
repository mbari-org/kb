const oniSend = async (url, params) => {
  try {
    const response = await fetch(url, params)
    const payload = await response.json()

    switch (response.status) {
      case 200:
        break
      case 400:
        return returnError("Bad Request", url, payload.message)
      case 401:
        return returnError("Unauthorized", url, payload.message)
      case 403:
        return returnError("Forbidden", url, payload.message)
      case 404:
        return returnError("Not Found", url, payload.message)
      case 500:
        return returnError("Internal Server Error", url, "")
      default:
        return returnError(`Unknown Error: Status ${response.status}`, url, "")
    }
    return {
      payload,
    }
  } catch (error) {
    returnError("Unknown Error", url, error.message)
  }
}

const returnError = (title, url, message) => {
  return {
    error: {
      detail: `Processing ${url}`,
      message,
      title,
    },
  }
}

export { oniSend }
