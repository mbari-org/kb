import { use, useState } from 'react'

import { Box, Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'
import ToConceptChoice from '../ToConceptChoice'

const ChangeParentContent = () => {
  const theme = useTheme()

  const { concept } = use(ConceptContext)
  const { setModalData } = use(ModalContext)

  const [toConcept, setToConcept] = useState(null)

  const handleChange = (_event, selectedName) => {
    setToConcept(selectedName)
    setModalData({ parent: selectedName, modified: true })
  }

  const handleKeyUp = event => {
    const conceptName = event.target.value.trim()
    const modified = conceptName !== concept.parent
    setToConcept(conceptName)
    setModalData({ parent: conceptName, modified })
  }

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
            {concept.parent}
          </Typography>
        </Stack>
        <ToConceptChoice
          handleChange={handleChange}
          handleKeyUp={handleKeyUp}
          initialValue={null}
          label='To'
          omitChoices={[concept.name, concept.parent]}
          value={toConcept}
        />
      </Stack>
    </Box>
  )
}

export default ChangeParentContent
