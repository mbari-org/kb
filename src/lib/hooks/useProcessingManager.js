import { useCallback, useMemo, useRef, useState } from 'react'

import CONFIG from '@/text'

const { PROCESSING } = CONFIG

const createId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

const buildMessage = (processingKey, processingValue) => {
  if (processingKey === PROCESSING.OFF) return PROCESSING.OFF
  return `${processingKey}${processingValue ? ` ${processingValue}` : ''} ...`
}

const useProcessingManager = () => {
  const operationsRef = useRef(new Map())
  const [processingCount, setProcessingCount] = useState(0)
  const [processingMessage, setProcessingMessage] = useState(PROCESSING.OFF)

  const updateState = useCallback(
    messageOverride => {
      const size = operationsRef.current.size
      setProcessingCount(size)
      if (messageOverride) {
        setProcessingMessage(messageOverride)
        return
      }
      if (size === 0) {
        setProcessingMessage(PROCESSING.OFF)
        return
      }
      const last = Array.from(operationsRef.current.values()).at(-1)
      setProcessingMessage(last.message)
    },
    []
  )

  const beginProcessing = useCallback(
    (processingKey, processingValue, { delayMs = 0, timeoutMs = 30000 } = {}) => {
      const id = createId()
      const message = buildMessage(processingKey, processingValue)
      let registered = false
      let delayId = null
      let timeoutId = null

      const register = () => {
        if (registered) return
        registered = true
        operationsRef.current.set(id, { message, start: Date.now() })
        updateState(message)
      }

      if (delayMs > 0) {
        delayId = setTimeout(register, delayMs)
      } else {
        register()
      }

      const cleanup = () => {
        if (delayId) {
          clearTimeout(delayId)
        }
        if (timeoutId) {
          clearTimeout(timeoutId)
        }
        if (!operationsRef.current.has(id)) return
        operationsRef.current.delete(id)
        updateState()
      }

      timeoutId = setTimeout(() => {
        cleanup()
      }, timeoutMs)

      const stop = () => cleanup()
      stop.updateMessage = newMessage => {
        if (!operationsRef.current.has(id)) return
        operationsRef.current.set(id, { message: newMessage, start: Date.now() })
        updateState(newMessage)
      }

      return stop
    },
    [updateState]
  )

  const withProcessing = useCallback(
    async (fn, processingKey, processingValue, options) => {
      const stop = beginProcessing(processingKey, processingValue, options)
      try {
        return await fn()
      } finally {
        stop()
      }
    },
    [beginProcessing]
  )

  const resetProcessing = useCallback(() => {
    operationsRef.current.clear()
    setProcessingCount(0)
    setProcessingMessage(PROCESSING.OFF)
  }, [])
  const processing = useMemo(() => processingCount > 0, [processingCount])

  return {
    beginProcessing,
    processing,
    processingMessage,
    resetProcessing,
    withProcessing,
  }
}

export default useProcessingManager
