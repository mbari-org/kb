import { jwtDecode } from 'jwt-decode'

import authStore from '@/lib/store/authStore'

const decodeToken = () => {
  const { token } = authStore.get()
  try {
    const decodedToken = jwtDecode(token)
    const currentTime = Date.now() / 1000
    if (currentTime >= decodedToken.exp * 1000) {
      return { error: 'Expired JWT' }
    }
    return { decoded: decodedToken }
  } catch {
    return { error: 'Invalid JWT' }
  }
}

export default decodeToken
