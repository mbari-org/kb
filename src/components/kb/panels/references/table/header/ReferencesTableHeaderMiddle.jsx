import { useEffect, use } from 'react'
import { Stack } from '@mui/material'

import TextInput from '@/components/common/TextInput'

import ReferencesContext from '@/contexts/panels/references/ReferencesContext'

import useDebouncedField from '@/lib/hooks/useDebouncedField'

const ReferencesTableHeaderMiddle = () => {
  const { citationGlob, setCitationGlob } = use(ReferencesContext)
  const handleFieldChange = () => value => setCitationGlob(value)
  const [value, handleChange, setValue] = useDebouncedField(citationGlob, 'citation', handleFieldChange, 300)

  useEffect(() => {
    setValue(citationGlob || '')
  }, [citationGlob, setValue])

  return (
    <Stack direction='row' spacing={5} sx={{ alignItems: 'center', justifyContent: 'center' }}>
      <TextInput
        onChange={handleChange}
        placeholder='Filter Citation'
        size='small'
        sx={{ minWidth: 180 }}
        value={value}
      />
    </Stack>
  )
}

export default ReferencesTableHeaderMiddle
