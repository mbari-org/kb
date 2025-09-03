import { useCallback, useRef } from 'react'

/**
 * Low-level debouncing utility hook
 *
 * Creates a debounced version of any function with configurable delay.
 * Use this when you need:
 * - Custom debouncing logic for any function
 * - Multiple debounced functions in one component
 * - Non-form-field debouncing (API calls, validation, etc.)
 * - Full control over timing and behavior
 *
 * Examples:
 * - Search filters with custom onChange handlers
 * - API validation calls
 * - Complex form updates with multiple debounced operations
 * - URL validation or duplicate checking
 *
 * @param {Function} func - The function to debounce
 * @param {number} delay - Debounce delay in milliseconds (default: 333ms)
 * @returns {Function} Debounced version of the function
 */
const useDebounce = (func, delay = 333) => {
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
