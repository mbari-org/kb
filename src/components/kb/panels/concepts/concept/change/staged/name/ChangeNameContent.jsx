import { use, useState } from 'react'

import { Box, Stack, TextField, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import _TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'
import NameChangeExtent from '@/components/common/NameChangeExtent'
import ModalActionText from '@/components/common/ModalActionText'
import UserContext from '@/contexts/user/UserContext'

import useChangeNameHandlers from './useChangeNameHandlers'
import useConceptNameValidate from '@/components/kb/panels/concepts/concept/change/staged/useConceptNameValidate'

import { isAdmin } from '@/lib/auth/role'

const ChangeNameContent = () => {
  const theme = useTheme()

  const { concept, stagedState } = use(ConceptContext)
  const { user } = use(UserContext)

  const [name, setName] = useState({ value: concept.name, extent: '' })
  const [modifiedFields, setModifiedFields] = useState({ name: false })

  const { nameError, nameHelperText } = useConceptNameValidate(name, modifiedFields)
  const { handleNameChange, handleNameExtentChange } = useChangeNameHandlers(
    name,
    setName,
    nameError,
    setModifiedFields
  )

  const toColor = () => {
    return name.value !== concept.name && !nameError
      ? theme.concept.color.add
      : theme.palette.grey[700]
  }

  const isAdminUser = isAdmin(user)
  const realizationCount = stagedState?.realizations.length

  return (
    <Box>
      <ModalActionText text='Change Name' />
      <Stack direction='row' spacing={2} alignItems='center' sx={{ mt: 1, ml: 3 }}>
        <Typography sx={{ fontSize: '1.1em', transform: 'translateY(-0.375em)' }}>To:</Typography>
        <TextField
          error={nameError}
          fullWidth
          helperText={nameError ? nameHelperText : ' '}
          onChange={handleNameChange}
          onKeyUp={handleNameChange}
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
