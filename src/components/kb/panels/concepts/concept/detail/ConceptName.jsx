import { use, useState } from 'react'

import { Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import ConceptHierarchyIcon from '@/components/icon/ConceptHierarchyIcon'
import ConceptHierarchyChoices from '@/components/kb/panels/concepts/concept/change/staged/hierarchy/ConceptHierarchyChoices'
import DsgLink from '@/components/kb/panels/concepts/concept/detail/dsgLink/DsgLink'

import useConceptNameColor from '@/components/kb/panels/concepts/concept/detail/useConceptNameColor'

import UserContext from '@/contexts/user/UserContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

const ConceptName = () => {
  const theme = useTheme()

  const { isReadOnly } = use(UserContext)
  const { concept, isEditing } = use(ConceptContext)
  const { color: conceptColor, hasStagedDelete } = useConceptNameColor()

  const [showHierarchyChoicesModal, setShowHierarchyChoices] = useState(false)

  const showHierarchyButton = isEditing && !showHierarchyChoicesModal && !hasStagedDelete && !isReadOnly

  return (
    <Stack direction='row' sx={{ alignItems: 'center', position: 'relative' }}>
      <Typography
        component='div'
        sx={{
          backgroundColor: 'transparent',
          color: conceptColor,
          fontFamily: theme.concept.fontFamily,
          fontSize: theme.concept.infoFontSize,
          fontWeight: theme.concept.fontWeight,
        }}
        variant='body1'
      >
        <DsgLink concept={concept} />
      </Typography>
      {showHierarchyButton && <ConceptHierarchyIcon onClick={() => setShowHierarchyChoices(true)} />}
      {showHierarchyChoicesModal && <ConceptHierarchyChoices closeChoices={() => setShowHierarchyChoices(false)} />}
    </Stack>
  )
}

export default ConceptName
