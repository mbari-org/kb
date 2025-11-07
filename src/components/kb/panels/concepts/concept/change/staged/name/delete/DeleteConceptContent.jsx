import { use, useCallback, useState } from 'react'

import { Box, Stack, Typography } from '@mui/material'

import ProcessingMessage from '@/components/common/ProcessingMessage'
import RelatedDataCounts from '@/components/common/concept/RelatedDataCounts'

import ToConceptChoice from '@/components/kb/panels/concepts/concept/change/staged/structure/ToConceptChoice'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

const DeleteConceptContent = () => {
  const { concept } = use(ConceptContext)
  const { modalData, setModalData } = use(ConceptModalContext)
  const { getNames } = use(TaxonomyContext)

  const [isValid, setIsValid] = useState(true)
  const [reassign, setReassignTo] = useState(concept.parent)

  const { relatedDataCounts, isLoading } = modalData
  const hasRelatedData = relatedDataCounts?.some(count => count.value > 0)

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
    const reassign = event.target.value.trim()
    setReassignTo(reassign)
    const valid = validateChoice(reassign)
    setIsValid(valid)
    setModalData(prev => ({ ...prev, reassign: reassign, modified: valid, isValid: valid }))
  }

  return (
    <Box>
      <Typography align='center' color='cancel' sx={{ fontSize: theme => theme.typography.fontSize * 1.5, fontWeight: 'bold' }}>
        DELETE CONCEPT
      </Typography>
      {!modalData.isLoading && !hasRelatedData && (
        <Typography align='center'>
          This Concept has no related Annotations or Knowledge Base data.
        </Typography>
      )}
      {!modalData.isLoading && hasRelatedData && (
        <Typography align='center'>
          Related data must be reassigned to another concept.
        </Typography>
      )}

      {isLoading && <ProcessingMessage message='Loading related data...' />}
      {!modalData.isLoading && hasRelatedData && (
        <RelatedDataCounts
          relatedDataCounts={relatedDataCounts}
        />
      )}
      <Stack direction='column' spacing={1} alignItems='center'>
        <Box>
          {hasRelatedData && (
            <Box sx={{ ml: 1 }}>
              <ToConceptChoice
                error={!isValid}
                handleChange={handleChange}
                handleKeyUp={handleKeyUp}
                label='Reassign To'
                omitChoices={[concept.name]}
                required
                value={reassign}
              />
            </Box>
          )}
        </Box>

        {!isValid && (
          <Typography color='cancel' variant='caption'>
            Please select a valid concept to reassign Concept related data
          </Typography>
        )}
      </Stack>
    </Box>
  )
}

export default DeleteConceptContent
