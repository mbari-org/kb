import { useCallback, useState } from 'react'

import useDebounce from './useDebounce'

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

  return [value, handleChange, setValue]
}

export default useDebouncedField
