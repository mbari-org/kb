import { useEffect } from 'react'
import TextInput from '@/components/common/TextInput'
import useDebouncedField from '@/hooks/useDebouncedField'

const TableHeaderLinkFilter = ({ name, value: initialValue, onChange }) => {
  const handleFieldChange = fieldName => value => onChange(fieldName, value)

  const [value, handleChange, setValue] = useDebouncedField(
    initialValue,
    name,
    handleFieldChange,
    300
  )

  useEffect(() => {
    setValue(initialValue || '')
  }, [initialValue, setValue])

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
