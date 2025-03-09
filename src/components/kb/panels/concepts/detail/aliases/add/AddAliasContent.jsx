import { use, useMemo, useState } from 'react'
import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import ModalContext from '@/contexts/modal/ModalContext'

// import useHandleMediaSubmit from './useHandleMediaSubmit'

import { ALIAS_TYPES } from '@/lib/kb/concept/aliases'

import { EMPTY_ALIAS } from '@/components/kb/panels/concepts/detail/media/edit/alias'

export const ADD_ALIAS_FORM_ID = 'add-alias-form'

const AddAliasContent = () => {
  const theme = useTheme()

  const { modalData, setModalData } = use(ModalContext)
  const { alias } = modalData

  const [formAlias, setFormAlias] = useState(alias)

  const [modifiedFields, setModifiedFields] = useState({
    author: false,
    name: false,
    nameType: false,
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

  const handleChange = event => {
    const { name: field, value } = event.target

    const updatedAlias = {
      ...formAlias,
      [field]: value,
    }
    setFormAlias(updatedAlias)

    const fieldIsModified = updatedAlias[field] !== EMPTY_ALIAS[field]

    const updatedModifiedFields = { ...modifiedFields, [field]: fieldIsModified }
    setModifiedFields(updatedModifiedFields)

    const modified = Object.values(updatedModifiedFields).some(fieldIsModified => fieldIsModified)

    setModalData(prev => ({ ...prev, alias: updatedAlias, modified }))
  }

  // const handleSubmit = useHandleMediaSubmit(aliasIndex, {}, setModal)
  const handleSubmit = () => console.log('CxInc handleSubmit')

  return (
    <Box component='form' id={ADD_ALIAS_FORM_ID} onSubmit={handleSubmit}>
      <FormControl {...inputStyle}>
        <TextField
          label='Name'
          name='name'
          onChange={handleChange}
          required
          value={formAlias.name}
        />
      </FormControl>
      <FormControl {...inputStyle}>
        <TextField
          label='Author'
          name='author'
          onChange={handleChange}
          required
          value={formAlias.author}
        />
      </FormControl>
      <FormControl {...inputStyle}>
        <InputLabel id={`${formAlias.name}-name-type-label`}>Type</InputLabel>
        <Select
          displayEmpty
          labelId={`${formAlias.name}-name-type-label`}
          onChange={handleChange}
          required
          value={formAlias.nameType}
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
