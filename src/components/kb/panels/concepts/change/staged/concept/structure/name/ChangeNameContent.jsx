import { use, useState } from 'react'

import { Box, Stack, TextField, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'
import NameChangeExtent from '@/components/common/NameChangeExtent'
import AuthContext from '@/contexts/auth/AuthContext'

import { isAdmin } from '@/lib/auth/role'

const ChangeNameContent = () => {
  const theme = useTheme()

  const { concept } = use(ConceptContext)
  const { modalData, setModalData } = use(ModalContext)
  const { getNames } = use(TaxonomyContext)
  const { user } = use(AuthContext)

  const [primaryName, setPrimaryName] = useState(concept.name)

  const fromColor = 'main'
  const toColor = modalData.modified ? theme.palette.primary.edit : theme.palette.grey[500]

  const handleNameChange = event => {
    const { value } = event.target
    setPrimaryName(value)
    const modified = value !== concept.name && !getNames().includes(value)
    const isNameChangeTypeOK = !isAdmin(user) || (isAdmin(user) && modalData.nameChangeType)
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

  return (
    <Box>
      <Stack spacing={2} sx={{ mt: 2, ml: 3, mb: 2 }}>
        <Stack direction='row' spacing={2} alignItems='center'>
          <Typography minWidth={60}>From:</Typography>
          <Typography
            color={fromColor}
            fontFamily={theme.concept.fontFamily}
            fontSize={theme.concept.updateFontSize}
            fontWeight={theme.concept.fontWeight}
            variant='h6'
          >
            {concept.name}
          </Typography>
        </Stack>
        <Stack direction='row' spacing={2} alignItems='center'>
          <Typography minWidth={60}>To:</Typography>
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
            value={primaryName}
            variant='standard'
          />
        </Stack>
      </Stack>

      <Box sx={{ mt: -1, ml: 12 }}>
        <NameChangeExtent
          nameChangeType={modalData.nameChangeType}
          onChange={handleNameChangeType}
        />
      </Box>

      <Box sx={{ borderTop: '1px solid #000000', mt: 2 }}>
        <Typography variant='body1' color='text.secondary' sx={{ mt: 2 }}>
          {`Updating the name of concept will affect CxTBD link realizations.`}
        </Typography>
        {!isAdmin(user) && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant='body1' color='text.secondary'>
              {`Please communicate with an admin regarding this change as`}
            </Typography>
            <Typography variant='body1' color='text.secondary'>
              {`only admins can specify the extent of a Concept name change.`}
            </Typography>{' '}
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default ChangeNameContent
