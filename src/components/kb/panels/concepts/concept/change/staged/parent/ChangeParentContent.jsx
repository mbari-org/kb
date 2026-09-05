import { use, useCallback, useState } from 'react'

import { Box, Stack, Typography } from '@mui/material'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'
import ModalActionText from '@/components/common/ModalActionText'

import ToConceptChoice from '@/components/kb/panels/concepts/concept/change/staged/structure/ToConceptChoice'
import { validateConceptInput } from '@/components/modal/concept/conceptModalUtils'

import CONFIG from '@/lib/config'

const { MODALS } = CONFIG.PANELS.CONCEPTS

const ChangeParentContent = ({ omitChoices = [] }) => {
  const { concept } = use(ConceptContext)
  const { setModalData } = use(ConceptModalContext)
  const { getNames } = use(TaxonomyContext)

  const [toConcept, setToConcept] = useState(null)

  const validateInput = useCallback(
    input => validateConceptInput(input, getNames(), omitChoices),
    [getNames, omitChoices]
  )

  const handleChange = useCallback(
    (_event, selectedName) => {
      const isValid = validateInput(selectedName)
      setToConcept(selectedName)
      setModalData(prev => ({
        ...prev,
        isValid,
        modified: isValid,
        parent: selectedName,
      }))
    },
    [setModalData, validateInput]
  )

  const handleKeyUp = useCallback(
    event => {
      const conceptName = event.target.value.trim()
      const isValid = validateInput(conceptName)
      setToConcept(conceptName)
      setModalData(prev => ({
        ...prev,
        isValid,
        modified: isValid,
        parent: conceptName,
      }))
    },
    [setModalData, validateInput]
  )

  return (
    <Box>
      <Stack direction='row' spacing={1} sx={{ alignItems: 'center' }}>
        <ModalActionText text={MODALS.STRUCTURE.CHANGE_PARENT.LABEL} />
        <Typography sx={{ fontWeight: 'bold' }} variant='h6'>
          {concept.parent}
        </Typography>
      </Stack>
      <Box sx={{ mt: 1, ml: 3 }}>
        <ToConceptChoice
          error={toConcept !== null && toConcept !== '' && !validateInput(toConcept)}
          handleChange={handleChange}
          handleKeyUp={handleKeyUp}
          label={MODALS.STRUCTURE.CHANGE_PARENT.TO}
          omitChoices={omitChoices}
          value={toConcept}
        />
      </Box>
    </Box>
  )
}

export default ChangeParentContent
