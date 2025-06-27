import { use, useCallback, useEffect, useState } from 'react'

import { Box, FormControl, TextField } from '@mui/material'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import useConceptDetailStyle from '@/components/kb/panels/concepts/concept/change/staged/useConceptDetailStyle'
import useStagedFieldBorder from '@/components/kb/panels/concepts/concept/change/staged/concept/field/useStagedFieldBorder'

import useDebounce from '@/hooks/useDebounce'

import { CONCEPT_STATE } from '@/lib/constants'

const ConceptAuthor = () => {
  const { stagedState, modifyConcept } = use(ConceptContext)

  const [author, setAuthor] = useState('')

  const border = useStagedFieldBorder('author')

  const modifyAuthor = useCallback(
    author => {
      modifyConcept({
        type: CONCEPT_STATE.FIELD.SET,
        update: { field: 'author', value: author },
      })
    },
    [modifyConcept]
  )

  const debouncedAuthor = useDebounce(modifyAuthor)

  const infoStyle = useConceptDetailStyle('Author')

  const handleChange = useCallback(
    event => {
      setAuthor(event.target.value)
      debouncedAuthor(event.target.value)
    },
    [debouncedAuthor]
  )

  useEffect(() => {
    setAuthor(stagedState.author || '')
  }, [stagedState.author])

  return (
    <FormControl>
      <Box sx={{ ...border }}>
        <TextField {...infoStyle} label='Author' onChange={handleChange} value={author || ''} />
      </Box>
    </FormControl>
  )
}

export default ConceptAuthor
