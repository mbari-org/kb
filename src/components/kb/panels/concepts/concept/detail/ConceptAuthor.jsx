import { use, useCallback } from 'react'
import { Box } from '@mui/material'

import TextInput from '@/components/common/TextInput'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import useConceptDetailStyle from '@/components/kb/panels/concepts/concept/change/staged/useConceptDetailStyle'

import stagedBorder from '@/components/kb/panels/concepts/concept/change/staged/stagedBorder'

import { CONCEPT } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import CONFIG from '@/text'

const ConceptAuthor = () => {
  const { isEditing, initialState, modifyConcept, stagedState } = use(ConceptContext)

  const border = stagedBorder(initialState.author?.value, stagedState.author?.value)

  const infoStyle = useConceptDetailStyle(CONCEPT.FIELD.AUTHOR)

  const handleChange = useCallback(
    event => {
      const value = event.target.value
      modifyConcept({
        type: CONCEPT_STATE.AUTHOR,
        update: {
          field: CONCEPT.FIELD.AUTHOR,
          value,
          initialAuthor: initialState.author,
        },
      })
    },
    [modifyConcept, initialState]
  )

  return (
    <Box sx={{ ...border }}>
      <TextInput
        {...infoStyle}
        label={CONFIG.PANELS.CONCEPTS.AUTHOR.LABEL}
        onChange={handleChange}
        showClearButton={isEditing}
        value={stagedState.author?.value || ''}
      />
    </Box>
  )
}

export default ConceptAuthor
