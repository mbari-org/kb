import { use, useEffect, useState, useMemo } from 'react'

import { Box, Stack, Typography } from '@mui/material'

import ToConceptChoice from '@/components/kb/panels/concepts/concept/change/staged/structure/ToConceptChoice'

import ConfigContext from '@/contexts/config/ConfigContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { getConceptAnnotationCount } from '@/lib/api/annotations'

const DeleteConceptContent = () => {
  const { apiFns } = use(ConfigContext)
  const { concept } = use(ConceptContext)
  const { setModalData } = use(ConceptModalContext)
  const { getNames } = use(TaxonomyContext)

  const [annotationCount, setAnnotationCount] = useState(0)
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

  useEffect(() => {
    const getCount = async () => {
      const payload = await apiFns.apiPayload(getConceptAnnotationCount, concept.name)
      const { count } = payload.content
      setAnnotationCount(count)
    }
    getCount()
  }, [apiFns, concept.name])

  const annotationsMessage =
    annotationCount === 0
      ? 'This concept has no annotations.'
      : `This concept has ${annotationCount} annotation${
        annotationCount !== 1 ? 's' : ''
      } which must be reassigned.`

  return (
    <Box>
      <Typography align='center' color='cancel' variant='h6'>
        DELETE
      </Typography>
      <Typography align='center'>{annotationsMessage}</Typography>
      <Stack direction='column' spacing={1} alignItems='center'>
        <Box>
          {annotationCount > 0 && (
            <Box sx={{ width: '80%', mx: 'auto', mt: 2 }}>
              <ToConceptChoice
                error={!isValid}
                handleChange={handleChange}
                handleKeyUp={handleKeyUp}
                label='Assign To'
                omitChoices={[concept.name]}
                required
                value={reassignTo}
              />
            </Box>
          )}
        </Box>

        {!isValid && (
          <Typography color='cancel' variant='caption'>
            Please select a valid concept to reassign annotations
          </Typography>
        )}
      </Stack>
    </Box>
  )
}

export default DeleteConceptContent
