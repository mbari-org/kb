import { use, useCallback, useEffect, useState } from 'react'

import useDebounce from '@/lib/hooks/useDebounce'

import { Box, Stack, TextField, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import ModalActionText from '@/components/common/ModalActionText'
import NameChangeExtent from '@/components/common/NameChangeExtent'
import ProcessingMsg from '@/components/common/ProcessingMessage'
import RelatedDataCounts from '@/components/common/concept/RelatedDataCounts'

import useConceptNameValidate from '@/components/kb/panels/concepts/concept/change/staged/useConceptNameValidate'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import UserContext from '@/contexts/user/UserContext'

import useChangeNameHandlers from './useChangeNameHandlers'

import { isAdmin } from '@/lib/auth/role'

const ChangeNameContent = () => {
  const theme = useTheme()

  const { concept } = use(ConceptContext)
  const { modalData, setModalData } = use(ConceptModalContext)
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

  const isValidName = name.value !== concept.name && !nameError

  const handleUpdateModalData = useCallback(
    (nameValue, isValidValue) => {
      setModalData(prev => ({ ...prev, name: nameValue, isValid: isValidValue }))
    },
    [setModalData]
  )

  const debouncedUpdateModalData = useDebounce(handleUpdateModalData)

  useEffect(() => {
    debouncedUpdateModalData(name, isValidName)
  }, [name, isValidName, debouncedUpdateModalData])

  const toColor = () => {
    return isValidName
      ? theme.concept.color.add
      : theme.palette.grey[700]
  }

  const isAdminUser = isAdmin(user)

  const { relatedDataCounts } = modalData
  const hasRelatedData = relatedDataCounts?.some(count => count.value > 0)

  return (
    <Box>
      <ModalActionText text='Change Name' />
      {modalData?.isLoading && <ProcessingMsg message='Loading related data...' />}
      {!modalData?.isLoading && (
      <Box>
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
                lineHeight: '0',
                margin: '15px 0 0 10px',
              },
            }}
            value={name.value}
            variant='standard'
          />
        </Stack>
        <Box sx={{ ml: 6.75 }}>
          {isAdminUser && (
            <NameChangeExtent
              disabled={!isValidName}
              nameChangeType={name.extent}
              onChange={handleNameExtentChange}
              value={name.extent}
            />
          )}
        </Box>
        {!modalData.isLoading && hasRelatedData && (
          <RelatedDataCounts
            relatedDataCounts={relatedDataCounts}
          />
        )}
      </Box>
      )}
    </Box>
  )
}

export default ChangeNameContent
