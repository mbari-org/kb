import authStore from '@/lib/store/auth'

const apiParams = (method, data) => {
  const { token } = authStore.get()

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
    if (method === 'GET') {
      params.qs = new URLSearchParams(data).toString()
    } else {
      params.body = JSON.stringify(data)
    }
  }

  return params
}

export default apiParams
