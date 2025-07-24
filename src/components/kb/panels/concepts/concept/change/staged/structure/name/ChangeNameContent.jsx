import { use, useEffect, useState } from 'react'

import { Box, Stack, TextField, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'
import NameChangeExtent from '@/components/common/NameChangeExtent'
import UserContext from '@/contexts/user/UserContext'

import { isAdmin } from '@/lib/auth/role'

const ChangeNameContent = () => {
  const theme = useTheme()

  const { concept, stagedState } = use(ConceptContext)
  const { modalData, setModalData } = use(ConceptModalContext)
  const { getNames } = use(TaxonomyContext)
  const { user } = use(UserContext)

  const [name, setName] = useState(concept.name)

  // Handle case where modalData might be undefined
  const { modified = false, nameChangeType = '' } = modalData || {}

  const toColor = modified ? theme.palette.primary.edit : theme.palette.grey[500]

  const isAdminUser = isAdmin(user)

  const handleNameChange = event => {
    const { value } = event.target
    setName(value)
    const modified = value !== concept.name && !getNames().includes(value)
    const isNameChangeTypeOK = !isAdmin(user) || (isAdmin(user) && nameChangeType)
    setModalData(prevData => ({
      ...prevData,
      name: value,
      modified,
      isValid: modified && isNameChangeTypeOK,
    }))
  }

  const handleNameChangeType = event => {
    const value = event.target.value
    setModalData(prevData => ({
      ...prevData,
      nameChangeType: value,
      isValid: prevData.modified && value,
    }))
  }

  const realizationCount = stagedState?.realizations.length

  return (
    <Box>
      <Typography variant='h6'>Change Name</Typography>
      <Stack direction='row' spacing={2} alignItems='center' sx={{ mt: 1, ml: 3 }}>
        <Typography>To:</Typography>
        <TextField
          fullWidth
          onChange={handleNameChange}
          slotProps={{
            input: {
              sx: {
                color: toColor,
                cursor: 'text',
                fontFamily: theme.concept.fontFamily,
                fontSize: theme.concept.updateFontSize,
                fontWeight: theme.concept.fontWeight,
                height: 'auto',
                borderBottom: 'none',
                '&::before': { borderBottom: 'none' },
                '&::after': { borderBottom: 'none' },
              },
            },
          }}
          value={name}
          variant='standard'
        />
      </Stack>

      <Box sx={{ ml: 6.75 }}>
        {isAdminUser && (
          <NameChangeExtent nameChangeType={nameChangeType} onChange={handleNameChangeType} />
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
