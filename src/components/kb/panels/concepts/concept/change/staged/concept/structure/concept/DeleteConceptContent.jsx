import { use, useEffect, useState, useMemo } from 'react'

import { Box, Stack, Typography } from '@mui/material'

import ToConceptChoice from '../ToConceptChoice'

import ConfigContext from '@/contexts/config/ConfigContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import HOLDModalContext from '@/contexts/modal/panel/HOLDModalContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { getConceptAnnotationCount } from '@/lib/api/annotations'

const DeleteConceptContent = () => {
  const { apiFns } = use(ConfigContext)
  const { concept } = use(ConceptContext)
  const { setModalData } = use(HOLDModalContext)
  const { getNames } = use(TaxonomyContext)

  const [annotationCount, setAnnotationCount] = useState(0)
  const [isValid, setIsValid] = useState(true)
  const [toConcept, setToConcept] = useState(concept.parent)

  const allowedChoices = useMemo(() => {
    return getNames().filter(name => name !== concept.name)
  }, [getNames, concept.name])

  const validateChoice = choice => {
    return choice && allowedChoices.includes(choice)
  }

  const handleChange = (_event, selectedName) => {
    setToConcept(selectedName)
    const valid = validateChoice(selectedName)
    setIsValid(valid)
    setModalData({ parent: selectedName, modified: valid, isValid: valid })
  }

  const handleKeyUp = event => {
    const conceptName = event.target.value.trim()
    setToConcept(conceptName)
    const valid = validateChoice(conceptName)
    setIsValid(valid)
    setModalData({ parent: conceptName, modified: valid, isValid: valid })
  }

  useEffect(() => {
    const getCount = async () => {
      const payload = await apiFns.apiPayload(getConceptAnnotationCount, concept.name)
      const { count } = payload.content
      setAnnotationCount(count)
    }
    getCount()
  }, [apiFns, concept.name])

  useEffect(() => {
    setModalData({ parent: concept.parent, modified: true, isValid: true })
  }, [concept.parent, setModalData])

  return (
    <Box>
      <Typography align='center' color='cancel' variant='h5' sx={{ mt: 1 }}>
        WARNING
      </Typography>
      <Typography align='center'>Be sure you really want to delete this concept.</Typography>
      <Stack direction='column' spacing={1} alignItems='center' sx={{ mt: 5 }}>
        {annotationCount > 0 && (
          <Box>
            <Typography align='center'>
              This concept has {annotationCount} annotation{annotationCount !== 1 ? 's' : ''} which
              must be reassigned.
            </Typography>
            <Box sx={{ width: '80%', mx: 'auto', mt: 2 }}>
              <ToConceptChoice
                error={!isValid}
                handleChange={handleChange}
                handleKeyUp={handleKeyUp}
                label='Assign To'
                omitChoices={[concept.name]}
                required
                value={toConcept}
              />
            </Box>
          </Box>
        )}

        {!isValid && (
          <Typography color='error' variant='caption'>
            Please select a valid concept to assign the annotations to
          </Typography>
        )}
      </Stack>
    </Box>
  )
}

export default DeleteConceptContent
