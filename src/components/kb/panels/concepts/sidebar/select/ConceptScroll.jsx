import IconButton from '@mui/material/IconButton'
import { LuScrollText } from 'react-icons/lu'

import KBTooltip from '@/components/common/KBTooltip'

const ConceptScroll = ({ onScrollToConcept }) => {
  return (
    <KBTooltip title='Sroll to Concept'>
      <IconButton
        aria-label='scroll to concept'
        color='inherit'
        onClick={onScrollToConcept}
        size='small'
        sx={{ mr: 0.25 }}
      >
        <LuScrollText />
      </IconButton>
    </KBTooltip>
  )
}

export default ConceptScroll