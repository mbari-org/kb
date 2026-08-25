const apiParams = (method, data, token) => {

  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }

  const params = {
    method,
    headers,
  }

  if (data) {
    params.body = JSON.stringify(data)
  }

  return params
}

const paramsQs = params =>
  params ? new URLSearchParams(params).toString() : undefined

export { apiParams, paramsQs }
