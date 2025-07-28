import { use, useState } from 'react'

import { Box, Stack, TextField, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'
import NameChangeExtent from '@/components/common/NameChangeExtent'
import UserContext from '@/contexts/user/UserContext'

import useChangeNameHandlers from './useChangeNameHandlers'

import { isAdmin } from '@/lib/auth/role'

const ChangeNameContent = () => {
  const theme = useTheme()

  const { concept, stagedState } = use(ConceptContext)
  const { getNames } = use(TaxonomyContext)
  const { user } = use(UserContext)

  const [name, setName] = useState({ value: concept.name, extent: '' })

  const { handleNameChange, handleNameExtentChange, nameError, nameHelperText } =
    useChangeNameHandlers(name, setName)

  const toColor = () => {
    // If there's a 'Concept name already exists' error, show grey
    if (nameError && nameHelperText === 'Concept name already exists') {
      return theme.palette.grey[500]
    }
    // If name is different from original and not in taxonomy, show edit color
    if (name.value !== concept.name && !getNames().includes(name.value)) {
      return theme.palette.primary.edit
    }
    // Default to grey
    return theme.palette.grey[500]
  }

  const isAdminUser = isAdmin(user)

  const realizationCount = stagedState?.realizations.length

  return (
    <Box>
      <Typography variant='h6'>Change Name</Typography>
      <Stack direction='row' spacing={2} alignItems='center' sx={{ mt: 1, ml: 3 }}>
        <Typography sx={{ fontSize: '1.1em', transform: 'translateY(-0.375em)' }}>To:</Typography>
        <TextField
          error={nameError}
          fullWidth
          helperText={nameError ? nameHelperText : ' '}
          onChange={handleNameChange}
          slotProps={{
            input: {
              sx: {
                color: toColor(),
                cursor: 'text',
                fontFamily: theme.concept.fontFamily,
                fontSize: theme.concept.updateFontSize,
                fontWeight: theme.concept.fontWeight,
                height: 'auto',
              },
            },
          }}
          sx={{
            '& .MuiFormHelperText-root': {
              color: nameError ? theme.palette.cancel.main : 'transparent',
              margin: '15px 0 0 10px',
              lineHeight: '0',
            },
          }}
          value={name.value}
          variant='standard'
        />
      </Stack>

      <Box sx={{ ml: 6.75, mt: 2 }}>
        {isAdminUser && (
          <NameChangeExtent nameChangeType={name.extent} onChange={handleNameExtentChange} />
        )}
      </Box>

      {realizationCount > 0 && (
        <Box sx={{ borderTop: '1px solid #000000', mt: 2, textAlign: 'center' }}>
          <Typography variant='body1' color='text.secondary' sx={{ mt: 2 }}>
            {`Updating the name of concept will affect ${realizationCount} link realizations.`}
          </Typography>
          {!isAdminUser && (
            <Box sx={{ mt: 2 }}>
              <Typography variant='body1' color='text.secondary'>
                {'Please communicate with an admin regarding this change since'}
              </Typography>
              <Typography variant='body1' color='text.secondary'>
                {'when approving, an admin must specify whether to modify the'}
              </Typography>
              <Typography variant='body1' color='text.secondary'>
                {'associated link realizations.'}
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}

export default ChangeNameContent
