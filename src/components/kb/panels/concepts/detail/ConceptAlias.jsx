import { use } from 'react'
import { Stack, FormControl, TextField, Select, MenuItem, InputLabel } from '@mui/material'

import ConceptContext from '@/contexts/concept/ConceptContext'
import useConceptDetailStyle from './useConceptDetailStyle'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/concept'
import { ALTERNATE_NAME_TYPES } from '@/lib/kb/concept/names'

const ConceptAlias = ({ alias, index }) => {
  const { modifyConcept } = use(ConceptContext)

  const infoStyle = useConceptDetailStyle('Alias')

  return (
    <Stack direction='row' alignItems='center' spacing={1} width='100%'>
      <FormControl {...infoStyle} style={{ flex: 1 }}>
        <TextField
          {...infoStyle}
          label='Name'
          onChange={e =>
            modifyConcept({
              type: CONCEPT_STATE.NAME_EDIT,
              update: { name: e.target.value, aliasIndex: index },
            })
          }
          value={alias.name}
        />
      </FormControl>
      <FormControl {...infoStyle} style={{ flex: 1 }}>
        <TextField
          {...infoStyle}
          label='Author'
          onChange={e =>
            modifyConcept({
              type: CONCEPT_STATE.NAME_EDIT,
              update: { author: e.target.value, aliasIndex: index },
            })
          }
          value={alias.author}
        />
      </FormControl>
      <FormControl {...infoStyle} style={{ flex: 0.4 }}>
        <InputLabel id={`name-type-label-${index}`} shrink>
          Type
        </InputLabel>
        <Select
          labelId={`name-type-label-${index}`}
          displayEmpty
          onChange={e =>
            modifyConcept({
              type: CONCEPT_STATE.NAME_EDIT,
              update: { nameType: e.target.value, aliasIndex: index },
            })
          }
          value={alias.nameType}
        >
          {ALTERNATE_NAME_TYPES.map(value => (
            <MenuItem key={value} value={value}>
              {value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  )
}

export default ConceptAlias
