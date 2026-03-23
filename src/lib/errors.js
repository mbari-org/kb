import { ERROR_TEXT } from '@/lib/constants/errorText.js'

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

const HTTP_STATUS_TITLES = {
  400: ERROR_TEXT.HTTP['400'],
  401: ERROR_TEXT.HTTP['401'],
  403: ERROR_TEXT.HTTP['403'],
  404: ERROR_TEXT.HTTP['404'],
  500: ERROR_TEXT.HTTP['500'],
}

export const createConceptError = (conceptName, message, original = null) =>
  createError(ERROR_TEXT.TITLES.CONCEPT_LOADING, message, { conceptName }, original)

export const createValidationError = (message, details = {}) =>
  createError(ERROR_TEXT.TITLES.VALIDATION, message, details)

export const getHttpErrorTitle = status => {
  if (HTTP_STATUS_TITLES[status]) {
    return HTTP_STATUS_TITLES[status]
  }
  return ERROR_TEXT.HTTP.UNKNOWN
}
