import { useCallback, useRef } from 'react'

const useDebounce = (func, delay) => {
  const timeoutRef = useRef(null)

  const debouncedFunction = useCallback(
    (...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        func(...args)
      }, delay)
    },
    [func, delay]
  )

  return debouncedFunction
}

export default useDebounce
