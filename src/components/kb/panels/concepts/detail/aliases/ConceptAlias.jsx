import { use, useState } from 'react'
import { Stack, FormControl, TextField, Select, MenuItem, InputLabel } from '@mui/material'

import { useTheme } from '@mui/material/styles'

import AliasDelete from './AliasDelete'

import useConceptDetailStyle from '../useConceptDetailStyle'
import { aliasBorder } from '@/lib/kb/concept/aliases'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/concept'
import { ALIAS_TYPES } from '@/lib/kb/concept/aliases'
import { debounce } from '@/lib/util'

const ConceptAlias = ({ aliasIndex }) => {
  const theme = useTheme()

  const { editing, editingState, initialState, modifyConcept } = use(ConceptContext)

  // Both editedAlias and editingAlias are necessary due to debounce on edits
  const editingAlias = editingState.aliases[aliasIndex]
  const initialAlias = initialState.aliases[aliasIndex]
  const [editedAlias, setEditedAlias] = useState({
    action: editingAlias.action,
    author: editingAlias.author,
    name: editingAlias.name,
    nameType: editingAlias.nameType,
  })

  const isDeleted = editingAlias.action === CONCEPT_STATE.ALIAS_DELETE

  const border = aliasBorder(isDeleted, editingAlias, editedAlias, initialAlias, theme)
  const infoStyle = useConceptDetailStyle('Alias')

  const disabled = isDeleted || !editing

  const handleChange = field => event => {
    const newState = {
      ...editedAlias,
      [field]: event.target.value,
      action: CONCEPT_STATE.ALIAS_EDIT,
    }
    setEditedAlias(newState)
    debounce(() => {
      modifyConcept({
        type: CONCEPT_STATE.ALIAS_EDIT,
        update: newState,
      })
    }, 500)()
  }

  return (
    <Stack alignItems='center' direction='row' spacing={0} width='100%'>
      {editing && <AliasDelete aliasIndex={aliasIndex} />}
      <Stack alignItems='center' direction='row' spacing={1} width='100%' sx={{ border }}>
        <FormControl {...infoStyle} style={{ flex: 1 }}>
          <TextField
            {...infoStyle}
            disabled={disabled}
            label='Name'
            onChange={handleChange('name')}
            value={editedAlias.name}
          />
        </FormControl>
        <FormControl {...infoStyle} style={{ flex: 1 }}>
          <TextField
            {...infoStyle}
            disabled={disabled}
            label='Author'
            onChange={handleChange('author')}
            value={editedAlias.author}
          />
        </FormControl>
        <FormControl {...infoStyle} style={{ flex: 0.4 }}>
          <InputLabel id={`${editingAlias.name}-name-type-label`} shrink>
            Type
          </InputLabel>
          <Select
            displayEmpty
            disabled={disabled}
            labelId={`${editingAlias.name}-name-type-label`}
            onChange={handleChange('nameType')}
            value={editedAlias.nameType}
          >
            {ALIAS_TYPES.map(value => (
              <MenuItem key={value} value={value}>
                {value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </Stack>
  )
}

export default ConceptAlias
