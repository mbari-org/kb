import { useCallback } from 'react'

import CONFIG from '@/text'

const { PROCESSING } = CONFIG

const useSetProcessing = (setProcessingState, setProcessingMessage) => {
  return useCallback(
    (processingKey, processingValue) => {
      const keyName = Object.keys(PROCESSING).find(
        key => PROCESSING[key] === processingKey
      )

      if (!keyName) {
        const validKeys = Object.keys(PROCESSING)
          .filter(key => key !== PROCESSING.OFF)
          .join(', ')
        throw new Error(
          `Invalid PROCESSING key: ${processingKey}. Valid keys are: ${validKeys}`
        )
      }

      if (processingKey === PROCESSING.OFF) {
        setProcessingState(false)
        if (setProcessingMessage) {
          setProcessingMessage(PROCESSING.OFF)
        }
        return
      }

      const message = `${processingKey} ${processingValue ? `${processingValue}` : ''} ...`

      setProcessingState(true)
      if (setProcessingMessage) {
        setProcessingMessage(message)
      }
    },
    [setProcessingState, setProcessingMessage]
  )
}

export default useSetProcessing
