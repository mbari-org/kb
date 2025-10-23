import { use, useState, useMemo } from 'react'

import { Box, Stack, Typography } from '@mui/material'

import ProcessingMessage from '@/components/common/ProcessingMessage'

import ToConceptChoice from '@/components/kb/panels/concepts/concept/change/staged/structure/ToConceptChoice'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

const DeleteConceptContent = () => {
  const { concept } = use(ConceptContext)
  const { modalData, setModalData } = use(ConceptModalContext)
  const { getNames } = use(TaxonomyContext)

  const [isValid, setIsValid] = useState(true)
  const [reassignTo, setReassignTo] = useState(concept.parent)

  const allowedChoices = useMemo(() => {
    return getNames().filter(name => name !== concept.name)
  }, [getNames, concept.name])

  const validateChoice = choice => {
    return choice && allowedChoices.includes(choice)
  }

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

  return (
    <Box>
      <Typography align='center' color='cancel' variant='h6'>
        DELETE CONCEPT
      </Typography>
      {modalData.isLoading && <ProcessingMessage message='Loading related data...' />}
      {!modalData.isLoading && (
        modalData.associatedMessages.map((message, index) => (
          <Typography key={index} align='center'>
            {message}
          </Typography>
        ))
      )}
      <Stack direction='column' spacing={1} alignItems='center'>
        <Box>
          {modalData.hasAssociatedData && (
            <Box sx={{ width: '80%', mx: 'auto', mt: 2 }}>
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
