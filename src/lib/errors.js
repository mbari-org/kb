import { COMMON } from '@/text'

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
  400: COMMON.ERRORS.HTTP['400'],
  401: COMMON.ERRORS.HTTP['401'],
  403: COMMON.ERRORS.HTTP['403'],
  404: COMMON.ERRORS.HTTP['404'],
  500: COMMON.ERRORS.HTTP['500'],
}

export const createConceptError = (conceptName, message, original = null) =>
  createError(
    COMMON.ERRORS.TITLES.CONCEPT_LOADING,
    message,
    { conceptName },
    original
  )

export const createValidationError = (message, details = {}) =>
  createError(COMMON.ERRORS.TITLES.VALIDATION, message, details)

export const getHttpErrorTitle = status => {
  if (HTTP_STATUS_TITLES[status]) {
    return HTTP_STATUS_TITLES[status]
  }
  return COMMON.ERRORS.HTTP.UNKNOWN
}
