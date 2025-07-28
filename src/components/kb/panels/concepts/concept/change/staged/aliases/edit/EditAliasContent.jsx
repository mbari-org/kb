import { use, useMemo, useState } from 'react'
import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import TextInput from '@/components/common/TextInput'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import useEditAliasHandlers from './useEditAliasHandlers'
import useNameValidate from '@/components/kb/panels/concepts/concept/change/staged/useNameValidate'

import { ALIAS_TYPES } from '@/lib/kb/model/aliases'

export const ADD_ALIAS_FORM_ID = 'add-alias-form'

const EditAliasContent = () => {
  const theme = useTheme()

  const { stagedState } = use(ConceptContext)
  const { modalData } = use(ConceptModalContext)

  const [formAlias, setFormAlias] = useState(modalData.aliasItem)

  const actionText = modalData.action.split(' ').pop()

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

  const { handleStage, handleChange } = useEditAliasHandlers(formAlias, setFormAlias, stagedAlias)

  const { nameError, nameHelperText } = useNameValidate(formAlias, modalData.modified)

  return (
    <Box component='form' id={ADD_ALIAS_FORM_ID} onSubmit={handleStage}>
      <Typography variant='h6'>{actionText} Alias</Typography>
      <FormControl {...inputStyle}>
        <TextInput
          error={nameError}
          fullWidth
          helperText={nameHelperText}
          label='Name'
          name='name'
          onChange={handleChange('name')}
          required
          size='small'
          value={formAlias.name}
        />
      </FormControl>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <FormControl {...inputStyle} sx={{ flex: 1 }}>
          <TextInput
            fullWidth
            label='Author'
            name='author'
            onChange={handleChange('author')}
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
            onChange={handleChange('nameType')}
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
