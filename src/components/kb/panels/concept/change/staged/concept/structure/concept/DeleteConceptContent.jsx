import { use, useEffect, useState, useMemo } from 'react'

import { Box, Stack, Typography } from '@mui/material'

import ToConceptChoice from '../ToConceptChoice'

import ConfigContext from '@/contexts/config/ConfigContext'
import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { getConceptAnnotationCount } from '@/lib/kb/api/annotations'

const DeleteConceptContent = () => {
  const { config } = use(ConfigContext)
  const { concept } = use(ConceptContext)
  const { setModalData } = use(ModalContext)
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
    const fetchCount = async () => {
      const { error, count } = await getConceptAnnotationCount(config, concept.name)
      if (error) {
        console.error(error)
      } else {
        setAnnotationCount(count)
      }
    }
    fetchCount()
  }, [concept.name, config])

  useEffect(() => {
    setModalData({ parent: concept.parent, modified: true, isValid: true })
  }, [concept.parent, setModalData])

  return (
    <Box>
      <Typography align='center' color='cancel' variant='h5' sx={{ mt: 1, mb: 2 }}>
        WARNING
      </Typography>
      <Stack direction='column' spacing={0.5} alignItems='center'>
        <Typography align='center'>Be sure you really want to delete this concept.</Typography>
        <Typography align='center'>
          Nancy has a ruler and will crack your knuckles if you mess this up.
        </Typography>

        {annotationCount > 0 && (
          <>
            <Typography align='center' sx={{ mb: 1 }}>
              This concept has {annotationCount} annotation{annotationCount !== 1 ? 's' : ''}
            </Typography>
            <ToConceptChoice
              error={!isValid}
              handleChange={handleChange}
              handleKeyUp={handleKeyUp}
              label='Assign Annotations To'
              omitChoices={[concept.name]}
              required
              value={toConcept}
            />
          </>
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
