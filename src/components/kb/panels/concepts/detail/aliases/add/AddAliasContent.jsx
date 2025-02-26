import { use, useMemo, useState } from 'react'
import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'

// import useHandleMediaSubmit from './useHandleMediaSubmit'

import { ALIAS_TYPES } from '@/lib/kb/concept/aliases'
import { CONCEPT_STATE } from '@/lib/kb/concept/state/concept'

import useDebounceModifyAlias from '../useDebounceModifyAlias'

export const ADD_ALIAS_FORM_ID = 'add-alias-form'

const AddAliasContent = () => {
  const theme = useTheme()

  const { _editingState, _modifyConcept } = use(ConceptContext)
  const { _setModal } = use(ModalContext)

  const [editedAlias, setEditedAlias] = useState({
    action: CONCEPT_STATE.ALIAS_ADD,
    author: '',
    name: '',
    nameType: '',
  })

  const inputStyle = useMemo(
    () => ({
      fullWidth: true,
      margin: 'normal',
      size: 'small',
      sx: {
        '& .MuiInputBase-input': {
          backgroundColor: theme.palette.background.paper,
          color: '#000',
          WebkitTextFillColor: '#000',
        },
      },
      variant: 'filled',
    }),
    [theme]
  )

  const debounceModifyAlias = useDebounceModifyAlias(CONCEPT_STATE.ALIAS_ADD)

  const handleChange = field => event => {
    const update = {
      ...editedAlias,
      [field]: event.target.value,
    }
    setEditedAlias(update)
    debounceModifyAlias(update)
  }

  // const handleSubmit = useHandleMediaSubmit(aliasIndex, {}, setModal)
  const handleSubmit = () => console.log('CxInc handleSubmit')

  return (
    <Box component='form' id={ADD_ALIAS_FORM_ID} onSubmit={handleSubmit}>
      <FormControl {...inputStyle}>
        <TextField
          label='Name'
          name='name'
          onChange={handleChange('name')}
          required
          value={editedAlias.name}
        />
      </FormControl>
      <FormControl {...inputStyle}>
        <TextField
          label='Author'
          name='author'
          onChange={handleChange('author')}
          required
          value={editedAlias.author}
        />
      </FormControl>
      <FormControl {...inputStyle}>
        <InputLabel id={`${editedAlias.name}-name-type-label`}>Type</InputLabel>
        <Select
          displayEmpty
          labelId={`${editedAlias.name}-name-type-label`}
          onChange={handleChange('nameType')}
          required
          value={editedAlias.nameType}
        >
          {ALIAS_TYPES.map(value => (
            <MenuItem key={value} value={value}>
              {value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}

export default AddAliasContent
