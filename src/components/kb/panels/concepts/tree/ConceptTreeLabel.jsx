import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import { alpha } from '@mui/material/styles'

import ConceptMediaIcon from './ConceptMediaIcon'
import ConceptPendingHistoryIcon from './ConceptPendingHistoryIcon'

const StyledLabel = styled('div')(({ theme, hasPending, isSelected }) => {
  const baseStyle = {
    borderRadius: theme.spacing(0.8),
    display: 'flex',
    padding: theme.spacing(0.05, 1),  // Reduced from 0.1 to 0.05
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

  if (hasPending) {
    baseStyle.color = isSelected ? theme.palette.common.white : theme.palette.error.main
  }

  return baseStyle
})

const ConceptTreeLabel = ({ children, hasPending, isSelected, mediaCount }) => {
  return (
    <StyledLabel hasPending={hasPending} isSelected={isSelected}>
      <Box sx={{ display: 'flex', alignItems: 'top', flexGrow: 1, mr: 0.5 }}>
        <span>{children}</span>
        <ConceptMediaIcon mediaCount={mediaCount} isSelected={isSelected} />
        {isSelected && hasPending && <ConceptPendingHistoryIcon hasPending={hasPending} />}
      </Box>
    </StyledLabel>
  )
}

export default ConceptTreeLabel
