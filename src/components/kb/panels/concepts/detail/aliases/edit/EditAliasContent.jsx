import { use, useMemo, useState } from 'react'
import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import useStageAlias from './useStageAlias'

import { ALIAS_TYPES } from '@/lib/kb/concept/aliases'

export const ADD_ALIAS_FORM_ID = 'add-alias-form'

const EditAliasContent = () => {
  const theme = useTheme()

  const { stagedState } = use(ConceptContext)
  const { modalData, setModalData } = use(ModalContext)
  const { taxonomyNames } = use(TaxonomyContext)

  const [formAlias, setFormAlias] = useState(modalData.alias)

  const [modifiedFields, setModifiedFields] = useState({
    author: false,
    name: false,
    nameType: false,
  })

  const stagedAlias = useMemo(
    () => ({ ...stagedState.aliases[modalData.aliasIndex] }),
    [stagedState.aliases, modalData.aliasIndex]
  )

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

    const fieldIsModified = updatedAlias[field] !== stagedAlias[field]

    const updatedModifiedFields = { ...modifiedFields, [field]: fieldIsModified }
    setModifiedFields(updatedModifiedFields)

    const modified = Object.values(updatedModifiedFields).some(fieldIsModified => fieldIsModified)

    setModalData(prev => ({ ...prev, alias: updatedAlias, modified }))
  }

  const handleStage = useStageAlias()

  const isValidName = useMemo(() => {
    return !taxonomyNames.includes(formAlias.name)
  }, [formAlias.name, taxonomyNames])

  const nameError = modifiedFields.name && !isValidName

  const nameHelperText = !modifiedFields.name
    ? ''
    : formAlias.name.trim() === ''
    ? 'Name cannot be empty'
    : !isValidName
    ? 'Concept name already exists'
    : ''

  return (
    <Box component='form' id={ADD_ALIAS_FORM_ID} onSubmit={handleStage}>
      <FormControl {...inputStyle}>
        <TextField
          label='Name'
          name='name'
          onChange={handleChange}
          required
          value={formAlias.name}
          error={nameError}
          helperText={nameHelperText}
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
          label='Type'
          name='nameType'
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

export default EditAliasContent
