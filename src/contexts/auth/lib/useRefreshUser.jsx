import { useCallback } from "react"
import useInvalidAuth from "@/contexts/auth/lib/useInvalidAuth"
import useProcessAuth from "@/contexts/auth/lib/useProcessAuth"
import { extract } from "@/lib/auth/refresh"
import login from "@/lib/services/oni/auth/login"
import authStore from "@/lib/store/auth"
import useTokenExpiring from "@/contexts/auth/lib/useTokenExpiring"

const useRefreshUser = (config, setUser, user) => {
  const handleInvalidAuth = useInvalidAuth(setUser)
  const processAuth = useProcessAuth(setUser)
  const tokenExpiring = useTokenExpiring(user)

  return useCallback(() => {
    if (!tokenExpiring()) return Promise.resolve()

    return new Promise((resolve, reject) => {
      ;(async () => {
        try {
          const { refresh } = authStore.get()
          const userRefresh = await extract(refresh)
          if (userRefresh.error) throw userRefresh.error

          const { name } = user
          const { auth, error } = await login(
            config,
            name,
            userRefresh.password
          )
          if (error) throw error

          processAuth(auth)
          resolve()
        } catch (error) {
          handleInvalidAuth()
          reject(error)
        }
      })()
    })
  }, [handleInvalidAuth, processAuth, config, user, tokenExpiring])
}

export default useRefreshUser
