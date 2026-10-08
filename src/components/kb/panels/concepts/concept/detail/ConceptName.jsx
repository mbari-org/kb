import { use, useState } from 'react'

import { Box, Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import ConceptStructureIcon from '@/components/icon/ConceptStructureIcon'
import ChangeStructureChoices from '@/components/kb/panels/concepts/concept/change/staged/structure/ConceptStructureChoices'
import KBTooltip from '@/components/common/tooltip/KBTooltip'

import useStructureChoices from '@/components/kb/panels/concepts/concept/change/staged/structure/useStructureChoices'

import ConfigContext from '@/contexts/config/ConfigContext'
import UserContext from '@/contexts/user/UserContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { hasPendingStructure } from '@/lib/model/history'

import CONFIG from '@/lib/config'

const { TOOLTIP } = CONFIG.PANELS.CONCEPTS.PANEL

const ConceptName = () => {
  const theme = useTheme()

  const { dsgConceptUrl } = use(ConfigContext)
  const { isReadOnly } = use(UserContext)
  const { concept, isEditing, pending } = use(ConceptContext)

  const { hasStagedChildren, hasStagedDelete, hasStagedName, hasStagedParent } =
    useStructureChoices()
  const hasStagedStructure =
    hasStagedChildren || hasStagedDelete || hasStagedName || hasStagedParent

  const [showStructureChoicesModal, setShowStructureChoices] = useState(false)

  const showStructureButton =
    isEditing && !showStructureChoicesModal && !hasStagedDelete && !isReadOnly

  const hasPending = hasPendingStructure(pending, concept.name)

  const conceptColor =
    hasStagedStructure || hasPending.any ? theme.concept.color.edit : theme.palette.primary.main

  const dsgLink = dsgConceptUrl && concept?.name && (
    <KBTooltip title={TOOLTIP.DSG}>
      <Box
        component='a'
        href={`${dsgConceptUrl}${encodeURIComponent(concept.name)}`}
        rel='noopener noreferrer'
        sx={{ color: 'inherit', font: 'inherit', textDecoration: 'none' }}
        target='_blank'
      >
        {concept.name}
      </Box>
    </KBTooltip>
  )

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
        {dsgLink || concept?.name}
      </Typography>
      {showStructureButton && (
        <ConceptStructureIcon onClick={() => setShowStructureChoices(true)} />
      )}
      {showStructureChoicesModal && (
        <ChangeStructureChoices closeChoices={() => setShowStructureChoices(false)} />
      )}
    </Stack>
  )
}

export default ConceptName
