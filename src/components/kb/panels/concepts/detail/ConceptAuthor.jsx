import { use, useCallback, useEffect, useState } from 'react'

import { FormControl, TextField } from '@mui/material'

import ConceptContext from '@/contexts/concept/ConceptContext'

import useConceptDetailStyle from './useConceptDetailStyle'
import useDebounce from '@/lib/hooks/useDebounce'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/concept_state'

const ConceptAuthor = () => {
  const { editingState, modifyConcept } = use(ConceptContext)

  const [author, setAuthor] = useState('')

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

  const handleChange = event => {
    setAuthor(event.target.value)
    debouncedAuthor(event.target.value)
  }

  useEffect(() => {
    setAuthor(editingState.author)
  }, [editingState.author])

  return (
    <FormControl>
      <TextField {...infoStyle} label='Author' onChange={handleChange} value={author} />
    </FormControl>
  )
}

export default ConceptAuthor
