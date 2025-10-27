import { use, useCallback, useEffect, useState } from 'react'

import { Box, Stack, Typography } from '@mui/material'

import ProcessingMessage from '@/components/common/ProcessingMessage'

import ToConceptChoice from '@/components/kb/panels/concepts/concept/change/staged/structure/ToConceptChoice'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import useAssociatedCounts, { associatedMessages, ASSOCIATED_ACTIONS } from '../useAssociatedCounts'

const DeleteConceptContent = () => {

  const { concept } = use(ConceptContext)
  const { modalData, setModalData } = use(ConceptModalContext)
  const { getNames } = use(TaxonomyContext)

  const [isValid, setIsValid] = useState(true)
  const [reassignTo, setReassignTo] = useState(concept.parent)

  const associatedCounts = useAssociatedCounts()
  useEffect(() => {
    if (associatedCounts !== null) {
      setModalData(prev => ({
        ...prev,
        associatedCounts,
        associatedMessages: associatedMessages(ASSOCIATED_ACTIONS.DELETE, associatedCounts) }))
    }
  }, [associatedCounts, setModalData])

  const validateChoice = useCallback(choice =>
    getNames()
      .filter(name => name !== concept.name)
      .includes(choice),
  [getNames, concept.name])

  const handleChange = (_event, selectedName) => {
    setReassignTo(selectedName)
    const valid = validateChoice(selectedName)
    setIsValid(valid)
    setModalData(prev => ({ ...prev, toConcept: selectedName, modified: valid, isValid: valid }))
  }

  const handleKeyUp = event => {
    const reassignTo = event.target.value.trim()
    setReassignTo(reassignTo)
    const valid = validateChoice(reassignTo)
    setIsValid(valid)
    setModalData(prev => ({ ...prev, reassignTo: reassignTo, modified: valid, isValid: valid }))
  }

  const { removalMessages, reassignmentMessages } = modalData.associatedMessages

  const hasRemovals = removalMessages?.length > 0
  const hasReassignments = reassignmentMessages?.length > 0
  const hasAssociatedActions = hasRemovals || hasReassignments

  return (
    <Box>
      <Typography align='center' color='cancel' variant='h6'>
        DELETE CONCEPT
      </Typography>
      {modalData.isLoading && <ProcessingMessage message='Loading related data...' />}
      {!modalData.isLoading && hasAssociatedActions && (
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
        </Box>
      )}
      <Stack direction='column' spacing={1} alignItems='center'>
        <Box>
          {hasReassignments && (
            <Box sx={{ ml: 1 }}>
              <ToConceptChoice
                error={!isValid}
                handleChange={handleChange}
                handleKeyUp={handleKeyUp}
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
    </Box>
  )
}

export default DeleteConceptContent
