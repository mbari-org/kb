export const createError = (title, message, details = {}, original = null) => ({
  title,
  message,
  details,
  original,
})

export const createApiError = (title, message, url, params, original = null) => {
  const details = {
    body: params?.body ? JSON.parse(params.body) : undefined,
    method: params?.method,
    url,
  }

  return createError(title, message, details, original)
}

export const createConceptError = (conceptName, message, original = null) =>
  createError(
    'Concept Loading Error',
    message,
    { conceptName },
    original
  )

export const createValidationError = (message, details = {}) =>
  createError('Validation Error', message, details)

export const getHttpErrorTitle = status => {
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