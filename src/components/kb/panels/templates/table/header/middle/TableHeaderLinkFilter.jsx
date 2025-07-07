import { useCallback } from 'react'

import TextInput from '@/components/common/TextInput'
import useDebounce from '@/hooks/useDebounce'

const TableHeaderLinkFilter = ({ name, value, onChange }) => {
  const debouncedOnChange = useDebounce(onChange, 300)

  const handleChange = useCallback(
    event => {
      const newValue = event.target.value
      debouncedOnChange(name, newValue)
    },
    [debouncedOnChange, name]
  )

  return (
    <TextInput
      onChange={handleChange}
      placeholder={`Filter link ${name.replace('link', '').toLowerCase()}`}
      size='small'
      sx={{ minWidth: 100 }}
      value={value}
    />
  )
}

export default TableHeaderLinkFilter
