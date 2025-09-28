import { createApiError, getHttpErrorTitle } from '@/lib/errors'

const apiSend = async (url, params) => {
  try {
    const response = await fetch(url, params)

    if (response.status === 200) {
      const payload = await response.json()
      return { payload }
    }

    let errorMessage = `HTTP ${response.status}`
    try {
      const payload = await response.json()
      errorMessage = payload.message || errorMessage
    } catch {
      errorMessage = response.statusText || errorMessage
    }

    const title = getHttpErrorTitle(response.status)
    const apiError = createApiError(title, errorMessage, url, params)
    return { error: apiError }

  } catch (error) {
    const apiError = createApiError(
      'Network Error',
      error.message || 'Failed to complete request',
      url,
      params,
      error
    )
    return { error: apiError }
  }
}

export default apiSend
