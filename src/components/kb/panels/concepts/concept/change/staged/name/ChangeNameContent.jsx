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
  const { setModalData } = use(ConceptModalContext)
  const { getNames } = use(TaxonomyContext)
  const { user } = use(UserContext)

  const [name, setName] = useState({ value: concept.name, extent: '' })

  const toColor =
    name.value !== concept.name && !getNames().includes(name.value)
      ? theme.palette.primary.edit
      : theme.palette.grey[500]

  const isAdminUser = isAdmin(user)

  const realizationCount = stagedState?.realizations.length

  const isValidModified = updatedName => {
    const { extent, value } = updatedName

    const isNameModified = value !== concept.name
    const isNameValid = isNameModified && !getNames().includes(value)
    if (isAdminUser) {
      return {
        isValid: isNameValid && extent !== '',
        modified: isNameValid || extent !== '',
      }
    } else {
      return {
        isValid: isNameValid,
        modified: isNameModified,
      }
    }
  }

  const handleNameChange = event => {
    const updatedName = {
      extent: '',
      value: event.target.value,
    }
    setName(prevName => ({ ...prevName, ...updatedName }))

    const { isValid, modified } = isValidModified(updatedName)
    setModalData(prevData => ({
      ...prevData,
      isValid,
      modified,
      name: updatedName,
    }))
  }

  const handleNameExtentChange = event => {
    const updatedExtent = event.target.value
    setName(prevName => ({ ...prevName, extent: updatedExtent }))

    const { isValid, modified } = isValidModified({ ...name, extent: updatedExtent })
    setModalData(prevData => ({
      ...prevData,
      isValid,
      modified,
      name: { ...prevData.name, extent: updatedExtent },
    }))
  }

  useEffect(() => {
    setModalData({
      isValid: false,
      modified: false,
      name: { value: concept.name, extent: '' },
    })
  }, [concept, setModalData])

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
          value={name.value}
          variant='standard'
        />
      </Stack>

      <Box sx={{ ml: 6.75 }}>
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
