import { jwtDecode } from 'jwt-decode'

const processToken = token => {
  let decodedToken
  try {
    decodedToken = jwtDecode(token)
  } catch {
    return { error: 'Invalid Token' }
  }

  const { affiliation, email, exp, name, role, username } = decodedToken

  const currentTime = Date.now() / 1000
  if (!exp || exp < currentTime) {
    return { error: 'Expired Token' }
  }

  const user = {
    affiliation,
    email,
    expiry: exp,
    role,
    name: name || username,
  }

  return { user }
}

export default processToken
