import { use, useState, useRef, useEffect } from 'react'

import { Box, Stack, TextField, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'
import UserContext from '@/contexts/user/UserContext'

import { isAdmin } from '@/lib/auth/role'

const ChangeNameContent = () => {
  const theme = useTheme()
  const textFieldRef = useRef(null)

  const { concept } = use(ConceptContext)
  const { modalData, setModalData } = use(ConceptModalContext)
  const { getNames } = use(TaxonomyContext)
  const { user } = use(UserContext)

  const [primaryName, setPrimaryName] = useState(concept.name)

  // Handle case where modalData might be undefined
  const { modified = false, nameChangeType = '' } = modalData || {}

  const fromColor = 'main'
  const toColor = modified ? theme.palette.primary.edit : theme.palette.grey[500]

  useEffect(() => {
    if (textFieldRef.current) {
      textFieldRef.current.focus()
    }
  }, [])

  const handleNameChange = event => {
    const { value } = event.target
    setPrimaryName(value)
    const modified = value !== concept.name && !getNames().includes(value)
    const isNameChangeTypeOK = !isAdmin(user) || (isAdmin(user) && nameChangeType)
    setModalData(prevData => ({
      ...prevData,
      name: value,
      modified,
      isValid: modified && isNameChangeTypeOK,
    }))
  }

  return (
    <Box>
      <Typography variant='h6'>Change Name</Typography>
      <Stack alignItems='center' direction='row' spacing={1} sx={{ ml: 3 }}>
        <Typography>To:</Typography>
        <TextField
          inputRef={textFieldRef}
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

      <Box sx={{ mt: 2 }}>
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
