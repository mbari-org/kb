import authStore from '@/lib/store/auth'

const apiParams = (method, data) => {
  const { token } = authStore.get()

  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }

  return {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  }
}

export default apiParams
