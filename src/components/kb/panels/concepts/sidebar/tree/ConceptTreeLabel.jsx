import { memo } from 'react'
import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import { alpha } from '@mui/material/styles'
import { useTreeItemUtils } from '@mui/x-tree-view/hooks'

import ConceptMediaIcon from './ConceptMediaIcon'
import ConceptPendingHistoryIcon from './ConceptPendingHistoryIcon'
import useConceptItem from './lib/useConceptItem'

import { actionColor } from '@/components/kb/panels/concepts/concept/change/action'

const StyledLabel = styled('div')(({ theme, pendingAction, isSelected }) => {
  const baseStyle = {
    borderRadius: theme.spacing(0.8),
    display: 'flex',
    padding: theme.spacing(0.05, 1), // Reduced from 0.1 to 0.05
    width: '100%',
    color: theme.palette.common.black,
    fontWeight: 500,
    '&:hover': !isSelected && {
      backgroundColor: alpha(theme.palette.primary.main, 0.3),
      fontStyle: 'italic',
    },
  }

  if (isSelected) {
    baseStyle.color = theme.palette.common.white
    baseStyle.fontWeight = 600
    baseStyle.border = '1px solid'
    baseStyle.borderColor = theme.palette.primary.main
    baseStyle.backgroundColor = theme.palette.primary.main
  }

  if (pendingAction) {
    baseStyle.color = isSelected ? theme.palette.common.white : actionColor(pendingAction)
  }

  return baseStyle
})

const ConceptTreeLabel = ({ itemId }) => {
  const { status } = useTreeItemUtils({ itemId })
  const isSelected = status.selected
  const item = useConceptItem(itemId)

  if (!item) return null

  const { label, mediaCount, pendingAction } = item

  return (
    <StyledLabel pendingAction={pendingAction} isSelected={isSelected}>
      <Box sx={{ display: 'flex', alignItems: 'top', flexGrow: 1, mr: 0.5 }}>
        <span>{label}</span>
        <ConceptMediaIcon mediaCount={mediaCount} isSelected={isSelected} />
        {isSelected && pendingAction && <ConceptPendingHistoryIcon pendingAction={pendingAction} />}
      </Box>
    </StyledLabel>
  )
}

export default memo(ConceptTreeLabel)
