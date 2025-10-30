import { use, useCallback, useEffect, useState } from 'react'

import { Box, Stack, TextField, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import NameChangeExtent from '@/components/common/NameChangeExtent'
import ModalActionText from '@/components/common/ModalActionText'

import ToConceptChoice from '@/components/kb/panels/concepts/concept/change/staged/structure/ToConceptChoice'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'
import UserContext from '@/contexts/user/UserContext'

import useChangeNameHandlers from './useChangeNameHandlers'
import useConceptNameValidate from '@/components/kb/panels/concepts/concept/change/staged/useConceptNameValidate'
import useAssociatedCounts, { associatedMessages, ASSOCIATED_ACTIONS } from '../useAssociatedCounts'

import { isAdmin } from '@/lib/auth/role'
import ProcessingMessage from '@/components/common/ProcessingMessage'

const ChangeNameContent = () => {
  const theme = useTheme()

  const { concept } = use(ConceptContext)
  const { modalData, setModalData } = use(ConceptModalContext)
  const { getNames } = use(TaxonomyContext)
  const { user } = use(UserContext)

  const [name, setName] = useState({ value: concept.name, extent: '' })
  const [modifiedFields, setModifiedFields] = useState({ name: false })
  const [isValid, setIsValid] = useState(true)
  const [reassignTo, setReassignTo] = useState(concept.parent)

  const { nameError, nameHelperText } = useConceptNameValidate(name, modifiedFields)
  const { handleNameChange, handleNameExtentChange } = useChangeNameHandlers(
    name,
    setName,
    nameError,
    setModifiedFields
  )

  const isValidChange = name.value !== concept.name && !nameError

  const toColor = () => {
    return isValidChange
      ? theme.concept.color.add
      : theme.palette.grey[700]
  }

  const isAdminUser = isAdmin(user)

  const associatedCounts = useAssociatedCounts()
  useEffect(() => {
    if (associatedCounts !== null) {
      setModalData(prev => ({
        ...prev,
        associatedCounts,
        associatedMessages: associatedMessages(ASSOCIATED_ACTIONS.RENAME, associatedCounts) }))
    }
  }, [associatedCounts, setModalData])

  const { removalMessages, reassignmentMessages } = modalData.associatedMessages || {}
  const hasRemovals = removalMessages?.length > 0
  const hasReassignments = reassignmentMessages?.length > 0
  const hasAssociatedData = hasRemovals || hasReassignments

  const validateChoice = useCallback(choice =>
    getNames()
      .filter(name => name !== concept.name)
      .includes(choice),
  [getNames, concept.name])

  const handleReassignChange = (_event, selectedName) => {
    setReassignTo(selectedName)
    const valid = validateChoice(selectedName)
    setIsValid(valid)
    setModalData(prev => ({ ...prev, toConcept: selectedName, modified: valid, isValid: valid }))
  }

  const handleReassignKeyUp = event => {
    const reassignTo = event.target.value.trim()
    setReassignTo(reassignTo)
    const valid = validateChoice(reassignTo)
    setIsValid(valid)
    setModalData(prev => ({ ...prev, reassignTo: reassignTo, modified: valid, isValid: valid }))
  }

  return (
    <Box>
      <ModalActionText text='Change Name' />
      {modalData?.isLoading && <ProcessingMessage message='Loading related data...' />}
      {!modalData?.isLoading && (
      <>
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
          <NameChangeExtent disabled={!isValidChange} nameChangeType={name.extent} onChange={handleNameExtentChange} />
        )}
      </Box>

      {hasAssociatedData && (
        <Box>
          <Typography variant='body1' sx={{ ml: 1, mt: 2 }}>
            {'Associated Actions:'}
          </Typography>
          {hasRemovals && (
            <Box sx={{ mb: 2 }}>
              {removalMessages.map((message, index) => (
                <Typography key={`removal-${index}`} variant='body1' sx={{ ml: 6 }}>
                  {message}
                </Typography>
              ))}
            </Box>
          )}
          {hasReassignments && (
            <Box sx={{ mb: 2 }}>
              {reassignmentMessages.map((message, index) => (
                <Typography key={`reassignment-${index}`} variant='body1' sx={{ ml: 6 }}>
                  {message}
                </Typography>
              ))}
            </Box>
          )}
          {!isAdminUser && (
            <Box sx={{ mt: 2 }}>
              <Typography variant='body1' color='text.secondary'>
                {'Please communicate with an admin regarding this change.'}
              </Typography>
              <Typography variant='body1' color='text.secondary'>
                {'When approving, an admin must specify whether to modify data associated with the concept.'}
              </Typography>
            </Box>
          )}
        </Box>
      )}
      <Stack direction='column' spacing={1} alignItems='center'>
        <Box>
          {hasReassignments && (
            <Box sx={{ ml: 1 }}>
              <ToConceptChoice
                error={!isValid}
                handleChange={handleReassignChange}
                handleKeyUp={handleReassignKeyUp}
                label='Reassign To'
                omitChoices={[concept.name]}
                required
                value={reassignTo}
              />
            </Box>
          )}
        </Box>

        {!isValid && (
          <Typography color='cancel' variant='caption'>
            Please select a valid concept to reassign associated data
          </Typography>
        )}
      </Stack>
      </>
      )}
    </Box>
  )
}

export default ChangeNameContent
