import { useCallback } from 'react'

import { CONFIG } from '@/config/js'

const { PROCESSING } = CONFIG

const useSetProcessing = (setProcessingState, setProcessingMessage) => {
  return useCallback(
    (processingValue, arg) => {
      const keyName = Object.keys(PROCESSING).find(
        key => PROCESSING[key] === processingValue
      )

      if (!keyName) {
        const validValues = Object.values(PROCESSING)
          .filter(v => v !== PROCESSING.OFF)
          .join(', ')
        throw new Error(
          `Invalid PROCESSING value: ${processingValue}. Valid values are: ${validValues}`
        )
      }

      if (processingValue === PROCESSING.OFF) {
        setProcessingState(false)
        if (setProcessingMessage) {
          setProcessingMessage(PROCESSING.OFF)
        }
        return
      }

      const message = `${processingValue} ${arg ? `${arg}` : ''} ...`

      setProcessingState(true)
      if (setProcessingMessage) {
        setProcessingMessage(message)
      }
    },
    [setProcessingState, setProcessingMessage]
  )
}

export default useSetProcessing
