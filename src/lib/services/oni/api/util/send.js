const oniSend = async (url, params) => {
  try {
    const response = await fetch(url, params)
    const payload = await response.json()

    switch (response.status) {
      case 200:
        break
      case 400:
        return reportError(payload.message, response.status, url)
      case 401:
        return reportError(
          "Unauthorized. Perhaps you need to log in again?",
          response.status,
          url
        )
      case 403:
        return reportError(
          "Forbidden. Contact support for assistance",
          response.status,
          url
        )
      case 404:
        return reportError
      case 500:
        return reportError(
          "Internal Server Error. Contact support for assistance",
          response.status,
          url
        )
      default:
        return reportError(
          "Unknown Error. Contact support for assistance",
          response.status,
          url
        )
    }
    return {
      payload,
      status: response.status,
    }
  } catch (error) {
    reportError(error.message, 500, url)
  }
}

const reportError = (message, status, url) => {
  const error = new Error(`Error processing ${url}: ${message}`)
  console.error(`Error processing ${url}:`, error)
  throw error
}

export { oniSend }
