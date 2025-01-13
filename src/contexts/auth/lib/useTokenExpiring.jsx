import { useCallback } from "react"

const useTokenExpiring = user => {
  return useCallback(() => {
    const { expiry } = user
    const checkTime = Date.now() / 1000 + 3600
    return checkTime >= expiry
  }, [user])
}

export default useTokenExpiring
