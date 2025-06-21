import { use, useCallback, useState } from 'react'

import { Box, Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'

import ToConceptChoice from '../ToConceptChoice'

const ChangeParentContent = ({ omitChoices }) => {
  const theme = useTheme()

  const { concept } = use(ConceptContext)
  const { setModalData } = use(ModalContext)

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
      <Typography variant='h6'>Change Parent</Typography>
      <Stack spacing={2} sx={{ mt: 2, ml: 3, mb: 2 }}>
        <Stack direction='row' spacing={2} alignItems='center'>
          <Typography minWidth={60}>From:</Typography>
          <Typography
            color='main'
            fontFamily={theme.concept.fontFamily}
            fontSize={theme.concept.updateFontSize}
            fontWeight={theme.concept.fontWeight}
          >
            {concept?.parent}
          </Typography>
        </Stack>
        <ToConceptChoice
          handleChange={handleChange}
          handleKeyUp={handleKeyUp}
          initialValue={null}
          label='To'
          omitChoices={omitChoices}
          value={toConcept}
        />
      </Stack>
    </Box>
  )
}

export default ChangeParentContent
