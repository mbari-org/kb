import { use, useCallback, useEffect, useState } from 'react'
import { Box, FormControl } from '@mui/material'

import TextInput from '@/components/common/TextInput'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import useConceptDetailStyle from '@/components/kb/panels/concepts/concept/change/staged/useConceptDetailStyle'

import stagedBorder from '@/components/kb/panels/concepts/concept/change/staged/stagedBorder'

import { CONCEPT_FIELD, CONCEPT_STATE } from '@/lib/constants'

const ConceptAuthor = () => {
  const { initialState, modifyConcept, stagedState } = use(ConceptContext)

  const [author, setAuthor] = useState(stagedState.author)

  const border = stagedBorder(initialState.author, stagedState.author)

  const modifyAuthor = useCallback(
    author => {
      modifyConcept({
        type: CONCEPT_STATE.GROUP.AUTHOR,
        update: { field: CONCEPT_FIELD.AUTHOR, value: author },
      })
    },
    [modifyConcept]
  )

  const infoStyle = useConceptDetailStyle('Author')

  const handleChange = useCallback(
    event => {
      const newValue = event.target.value
      setAuthor(newValue)
      modifyAuthor(newValue)
    },
    [modifyAuthor]
  )

  useEffect(() => {
    setAuthor(stagedState.author || '')
  }, [stagedState.author])

  return (
    <FormControl>
      <Box sx={{ ...border }}>
        <TextInput
          {...infoStyle}
          debounceMs={333}
          label='Author'
          onChange={handleChange}
          value={author || ''}
        />
      </Box>
    </FormControl>
  )
}

export default ConceptAuthor
