import { useMemo } from 'react'

const useApiFns = (config, showBoundary) => {
  return useMemo(() => {
    if (!config) return null

    const apiPayload = async (payloadRequest, params) => {
      const { error, payload } = await payloadRequest(config, params)
      if (error) {
        showBoundary(error)
      }
      return payload
    }

    const apiPaginated = async (paginationRequest, params) => {
      // Even though the API returns limit and offset values, they simply echo the values sent by
      // the client. The values for limit and offset are maintained internally by the client itself.
      // So we can just return the payload content.
      const { error, payload } = await paginationRequest(config, params)
      if (error) {
        showBoundary(error)
      }
      return payload.content
    }

    const apiRaw = async (apiRequest, params) => apiRequest(config, params)

    const apiResult = async (apiRequest, params) => {
      const { error, result } = await apiRequest(config, params)
      if (error) {
        showBoundary(error)
      }
      return result
    }

    return {
      apiPayload,
      apiRaw,
      apiResult,
      apiPaginated,
    }
  }, [config, showBoundary])
}

export default useApiFns
