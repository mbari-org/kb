import { use, useCallback, useState } from 'react'

import { Box, Stack, Typography } from '@mui/material'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import ModalActionText from '@/components/common/ModalActionText'

import ToConceptChoice from '@/components/kb/panels/concepts/concept/change/staged/structure/ToConceptChoice'

import CONFIG from '@/text'

const { MODALS } = CONFIG.PANELS.CONCEPTS

const ChangeParentContent = ({ omitChoices }) => {
  const { concept } = use(ConceptContext)
  const { setModalData } = use(ConceptModalContext)

  const [toConcept, setToConcept] = useState(null)

  const handleChange = useCallback(
    (_event, selectedName) => {
      setToConcept(selectedName)
      setModalData({ parent: selectedName, modified: true })
    },
    [setModalData]
  )

  const handleKeyUp = useCallback(
    event => {
      const conceptName = event.target.value.trim()
      const modified = conceptName !== concept.parent
      setToConcept(conceptName)
      setModalData({ parent: conceptName, modified })
    },
    [concept.parent, setModalData]
  )

  return (
    <Box>
      <Stack alignItems='center' direction='row' spacing={1}>
        <ModalActionText text={MODALS.STRUCTURE.CHANGE_PARENT.LABEL} />
        <Typography sx={{ fontWeight: 'bold' }} variant='h6'>
          {concept.parent}
        </Typography>
      </Stack>
      <Box sx={{ mt: 1, ml: 3 }}>
        <ToConceptChoice
          handleChange={handleChange}
          handleKeyUp={handleKeyUp}
          initialValue={null}
          label={MODALS.STRUCTURE.CHANGE_PARENT.TO}
          omitChoices={omitChoices}
          value={toConcept}
        />
      </Box>
    </Box>
  )
}

export default ChangeParentContent
