const tokenIsExpiring = user => {
  const { expiry } = user
  const checkTime = Date.now() / 1000 + 3600
  return checkTime >= expiry
}

export default tokenIsExpiring
