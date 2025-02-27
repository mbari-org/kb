import { use } from 'react'

import { FormControl, TextField } from '@mui/material'

import ConceptContext from '@/contexts/concept/ConceptContext'

import useConceptDetailStyle from './useConceptDetailStyle'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/concept_state'

const ConceptAuthor = () => {
  const {
    editingState: { author },
    modifyConcept,
  } = use(ConceptContext)

  const infoStyle = useConceptDetailStyle('Author')

  return (
    <FormControl>
      <TextField
        {...infoStyle}
        label='Author'
        onChange={e =>
          modifyConcept({
            type: CONCEPT_STATE.FIELD.SET,
            update: { author: e.target.value },
          })
        }
        value={author}
      />
    </FormControl>
  )
}

export default ConceptAuthor
