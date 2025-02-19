import { use } from 'react'
import { FormControl, TextField } from '@mui/material'

import ConceptContext from '@/contexts/concept/ConceptContext'
import useConceptDetailStyle from './useConceptDetailStyle'
import { CONCEPT } from '@/contexts/concept/lib/conceptStateReducer'

const ConceptAlias = ({ alias }) => {
  const { modifyConcept } = use(ConceptContext)

  const infoStyle = useConceptDetailStyle('Alias')

  return (
    <FormControl>
      <TextField
        {...infoStyle}
        label='Name'
        onChange={e =>
          modifyConcept({
            type: CONCEPT.SET_FIELD,
            update: { alias: e.target.value },
          })
        }
        value={alias}
      />
    </FormControl>
  )
}

export default ConceptAlias
