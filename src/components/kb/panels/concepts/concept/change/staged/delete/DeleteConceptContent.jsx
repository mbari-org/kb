import { use, useEffect, useState, useMemo } from 'react'

import { Box, Stack, Typography } from '@mui/material'

import ToConceptChoice from '@/components/kb/panels/concepts/concept/change/staged/structure/ToConceptChoice'

import ConfigContext from '@/contexts/config/ConfigContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { getConceptAnnotationsCount } from '@/lib/api/annotations'
import { getToConceptAssociationsCount } from '@/lib/api/associations'
import { getConceptObservationsCount } from '@/lib/api/observations'
import { getConceptTemplateCount, getToConceptTemplateCount } from '@/lib/api/linkTemplates'

const DeleteConceptContent = () => {
  const { apiFns } = use(ConfigContext)
  const { concept } = use(ConceptContext)
  const { setModalData } = use(ConceptModalContext)
  const { getNames } = use(TaxonomyContext)

  const [assignedCounts, setAssignedCounts] = useState({
    conceptAnnotations: 0,
    toConceptAssociations: 0,
    conceptObservations: 0,
    conceptTemplates: 0,
    toConceptTemplates: 0,
  })
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
    const getAssignedCounts = async () => {
      const counts = await Promise.all([
        apiFns.apiResult(getConceptAnnotationsCount, concept.name),
        apiFns.apiResult(getToConceptAssociationsCount, concept.name),
        apiFns.apiResult(getConceptObservationsCount, concept.name),
        apiFns.apiResult(getConceptTemplateCount, concept.name),
        apiFns.apiResult(getToConceptTemplateCount, concept.name),
      ])
      setAssignedCounts(counts)
    }
    getAssignedCounts()
  }, [apiFns, concept.name])

  const hasAssignedData = Object.values(assignedCounts).some(count => count > 0)

  const assignmentMessage =
    hasAssignedData
      ? 'This concept does not have data that needs to be reassigned.'
      : 'This concept has data that needs to be reassigned.'

  return (
    <Box>
      <Typography align='center' color='cancel' variant='h6'>
        DELETE
      </Typography>
      <Typography align='center'>{assignmentMessage}</Typography>
      <Stack direction='column' spacing={1} alignItems='center'>
        <Box>
          {hasAssignedData && (
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
