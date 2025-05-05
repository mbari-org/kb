import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'

import ConceptMediaIcon from './ConceptMediaIcon'
import ConceptPendingHistoryIcon from './ConceptPendingHistoryIcon'

const StyledLabel = styled('div')(({ theme, hasPendingHistory, isSelected }) => {
  const nonHoverStyle = { color: theme.palette.common.black, fontWeight: 500 }

  if (isSelected) {
    nonHoverStyle.color = theme.palette.common.white
    nonHoverStyle.fontWeight = 600
  }

  if (hasPendingHistory) {
    nonHoverStyle.color = isSelected ? theme.palette.common.white : theme.palette.error.main
  }

  return {
    ...nonHoverStyle,
    '&:hover': !isSelected && {
      fontStyle: 'italic',
    },
  }
})

const ConceptTreeLabel = ({ children, hasPendingHistory, isSelected, mediaCount }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'top', flexGrow: 1, mr: 0.5 }}>
      <StyledLabel hasPendingHistory={hasPendingHistory} isSelected={isSelected}>
        {children}
      </StyledLabel>
      <ConceptMediaIcon mediaCount={mediaCount} isSelected={isSelected} />
      {isSelected && hasPendingHistory && (
        <ConceptPendingHistoryIcon hasPendingHistory={hasPendingHistory} />
      )}
    </Box>
  )
}

export default ConceptTreeLabel
