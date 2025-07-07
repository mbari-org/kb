import { use, useMemo, useState } from 'react'
import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import useStageAlias from './useStageAlias'

import { ALIAS_TYPES } from '@/lib/kb/model/alias'

export const ADD_ALIAS_FORM_ID = 'add-alias-form'

const EditAliasContent = () => {
  const theme = useTheme()

  const { stagedState } = use(ConceptContext)
  const { modalData, setModalData } = use(ConceptModalContext)
  const { getNames } = use(TaxonomyContext)

  const [formAlias, setFormAlias] = useState(modalData.alias)

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
    const updatedModified = { ...modalData.modified, [field]: fieldIsModified }

    setModalData(prev => ({ ...prev, alias: updatedAlias, modified: updatedModified }))
  }

  const stageAlias = useStageAlias()

  const isValidName = useMemo(() => {
    return !getNames().includes(formAlias.name)
  }, [formAlias.name, getNames])

  const nameError = modalData.modified.name && !isValidName

  const nameHelperText = !modalData.modified.name
    ? ''
    : formAlias.name.trim() === ''
    ? 'Name cannot be empty'
    : !isValidName
    ? 'Concept name already exists'
    : ''

  return (
    <Box component='form' id={ADD_ALIAS_FORM_ID} onSubmit={stageAlias}>
      <FormControl {...inputStyle}>
        <TextField
          error={nameError}
          helperText={nameHelperText}
          label='Name'
          name='name'
          onChange={handleChange}
          required
          size='small'
          value={formAlias.name}
        />
      </FormControl>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <FormControl {...inputStyle} sx={{ flex: 1 }}>
          <TextField
            label='Author'
            name='author'
            onChange={handleChange}
            size='small'
            value={formAlias.author}
          />
        </FormControl>
        <FormControl {...inputStyle} sx={{ width: 130 }}>
          <InputLabel id={`${formAlias.name}-name-type-label`}>Type</InputLabel>
          <Select
            displayEmpty
            label='Type'
            name='nameType'
            labelId={`${formAlias.name}-name-type-label`}
            onChange={handleChange}
            required
            size='small'
            sx={{ height: 43.2812 }}
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
    </Box>
  )
}

export default EditAliasContent
