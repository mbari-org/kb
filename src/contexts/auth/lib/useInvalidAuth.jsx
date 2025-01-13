import { useCallback } from "react"
import { useNavigate } from "react-router-dom"
import authStore from "@/lib/store/auth"

const useInvalidAuth = setUser => {
  const navigate = useNavigate()

  return useCallback(() => {
    authStore.clear()
    setUser(null)
    navigate("/login")
    // navigate does not change, so no need to include it in the dependency array
  }, [navigate, setUser])
}

export default useInvalidAuth
