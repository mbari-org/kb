import { useCallback, useState } from 'react'

import useDebounce from './useDebounce'

/**
 * High-level form field debouncing hook
 *
 * Manages both local state and debounced field updates for form inputs.
 * Use this when you need:
 * - Standard form field behavior with debounced updates
 * - Automatic state management for input values
 * - Structured field updates with field names
 * - Simple debounced form inputs
 *
 * Examples:
 * - Form fields that update parent state (DOI, citation inputs)
 * - Multi-field forms with consistent update patterns
 * - Text inputs that need responsive UI + debounced persistence
 *
 * Note: Expects handleFieldChange to be a curried function:
 * handleFieldChange(fieldName)(value)
 *
 * @param {string} initialValue - Initial value for the field
 * @param {string} fieldName - Name of the field for updates
 * @param {Function} handleFieldChange - Curried function that takes fieldName and returns value handler
 * @param {number} delay - Debounce delay in milliseconds (default: 333ms)
 * @returns {Array} [currentValue, changeHandler] - Value and onChange handler for the input
 */
const useDebouncedField = (initialValue, fieldName, handleFieldChange, delay) => {
  const [value, setValue] = useState(initialValue || '')

  const debouncedChange = useCallback(
    value => {
      handleFieldChange(fieldName)(value)
    },
    [handleFieldChange, fieldName]
  )

  const debouncedHandler = useDebounce(debouncedChange, delay)

  const handleChange = useCallback(
    event => {
      const newValue = event.target.value
      setValue(newValue)
      debouncedHandler(newValue)
    },
    [debouncedHandler]
  )

  return [value, handleChange]
}

export default useDebouncedField
