import { drop } from '@/lib/util'

const apiSend = async (url, params) => {
  try {
    const response = await fetch(url, params)
    const payload = await response.json()
    if (response.status === 200) {
      return { payload }
    }
    if (response.status === 401) {
      return errorResponse(errorTitle(response.status), 'Unauthorized: Invalid token', url, params)
    }

    return errorResponse(errorTitle(response.status), payload.message, url, params)
  } catch (error) {
    return errorResponse('Unknown Error', error.message, url, params)
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

const errorResponse = (title, message, url, params) => {
  const { headers, ...rest } = params
  const detailParams = { headers: drop(headers, 'Authorization'), ...rest }

  const detail = `URL: ${url}\nParams: ${JSON.stringify(detailParams)}`
  const error = {
    detail,
    message,
    title,
    type: 'error',
  }
  console.error(error)
  console.error('Authorization', headers?.Authorization)
  return { error }
}

export default apiSend
