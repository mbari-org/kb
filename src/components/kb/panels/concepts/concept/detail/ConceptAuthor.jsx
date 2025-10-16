import { use, useCallback } from 'react'
import { Box, FormControl } from '@mui/material'

import TextInput from '@/components/common/TextInput'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import useConceptDetailStyle from '@/components/kb/panels/concepts/concept/change/staged/useConceptDetailStyle'

import stagedBorder from '@/components/kb/panels/concepts/concept/change/staged/stagedBorder'

import { CONCEPT_FIELD, CONCEPT_STATE } from '@/lib/constants'

const ConceptAuthor = () => {
  const { isEditing, initialState, modifyConcept, stagedState } = use(ConceptContext)

  const border = stagedBorder(initialState.author, stagedState.author)

  const infoStyle = useConceptDetailStyle('Author')

  const handleChange = useCallback(
    event => {
      const value = event.target.value
      modifyConcept({
        type: CONCEPT_STATE.AUTHOR,
        update: { field: CONCEPT_FIELD.AUTHOR, value },
      })
    },
    [modifyConcept]
  )

  return (
    <FormControl>
      <Box sx={{ ...border }}>
        <TextInput
          {...infoStyle}
          debounceMs={333}
          label='Author'
          onChange={handleChange}
          showClearButton={isEditing}
          value={stagedState.author?.value || ''}
        />
      </Box>
    </FormControl>
  )
}

export default ConceptAuthor
