const apiSend = async (url, params) => {
  try {
    const response = await fetch(url, params)

    if (response.status === 200) {
      const payload = await response.json()
      return { payload }
    }

    if (response.status === 401) {
      return errorResponse(
        null,
        errorTitle(response.status),
        'Unauthorized: Invalid token',
        url,
        params
      )
    }

    let errorMessage = `HTTP ${response.status}`
    try {
      const payload = await response.json()
      errorMessage = payload.message || errorMessage
    } catch {
      errorMessage = response.statusText || errorMessage
    }

    return errorResponse(null, errorTitle(response.status), errorMessage, url, params)
  } catch (error) {
    return errorResponse(error, 'Error', error.message, url, params)
  }
}

const errorTitle = status => {
  switch (status) {
    case 400:
      return 'Bad Request'
    case 401:
      return 'Unauthorized'
    case 403:
      return 'Forbidden'
    case 404:
      return 'Not Found'
    case 500:
      return 'Internal Server Error'
    default:
      return 'Unknown Error'
  }
}

const errorResponse = (error, title, message, url, params) => {
  const whoops = {
    message,
    method: params.method,
    title,
    url,
  }
  console.error(whoops)
  console.error('Authorization', params?.headers?.Authorization)

  const wrappedError = {
    original: error,
    whoops,
  }

  return { error: wrappedError }
}

export default apiSend
