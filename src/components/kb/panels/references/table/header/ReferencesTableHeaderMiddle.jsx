import { useEffect, use } from 'react'
import { Button, Stack } from '@mui/material'

import TextInput from '@/components/common/TextInput'

import ReferencesContext from '@/contexts/panels/references/ReferencesContext'

import useDebouncedField from '@/lib/hooks/useDebouncedField'
import CONFIG from '@/lib/config'

const ReferencesTableHeaderMiddle = () => {
  const { citationGlob, conceptGlob, setCitationGlob, setConceptGlob } = use(ReferencesContext)
  const handleFieldChange = key => value => {
    switch (key) {
      case 'concept':
        setConceptGlob(value)
        break
      case 'citation':
        setCitationGlob(value)
        break
      default:
        throw new Error(`Unknown references filter key: ${key}`)
    }
  }
  const [conceptValue, handleConceptChange, setConceptValue] = useDebouncedField(
    conceptGlob,
    'concept',
    handleFieldChange,
    300
  )
  const [citationValue, handleCitationChange, setCitationValue] = useDebouncedField(
    citationGlob,
    'citation',
    handleFieldChange,
    300
  )

  useEffect(() => {
    setConceptValue(conceptGlob || '')
  }, [conceptGlob, setConceptValue])
  useEffect(() => {
    setCitationValue(citationGlob || '')
  }, [citationGlob, setCitationValue])

  const isClearFiltersDisabled = !conceptValue && !citationValue
  const handleClearFilters = () => {
    setConceptValue('')
    setCitationValue('')
    setConceptGlob('')
    setCitationGlob('')
  }

  return (
    <Stack direction='row' spacing={5} sx={{ alignItems: 'center', justifyContent: 'center' }}>
      <TextInput
        onChange={handleCitationChange}
        placeholder='Filter Citation'
        size='small'
        sx={{ minWidth: 180 }}
        value={citationValue}
      />
      <Button
        disabled={isClearFiltersDisabled}
        onClick={handleClearFilters}
        sx={{
          fontSize: '0.8rem',
        }}
      >
        {CONFIG.BUTTON.CLEAR_FILTERS}
      </Button>
      <TextInput
        onChange={handleConceptChange}
        placeholder='Filter Concept'
        size='small'
        sx={{ minWidth: 180 }}
        value={conceptValue}
      />
    </Stack>
  )
}

export default ReferencesTableHeaderMiddle
