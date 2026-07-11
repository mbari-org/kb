import IconButton from '@mui/material/IconButton'
import { LuScrollText } from 'react-icons/lu'
import KBTooltipTarget from '@/components/common/tooltip/KBTooltipTarget'

const ConceptScroll = ({ onScrollToConcept }) => {
  return (
    <KBTooltipTarget title='Sroll to Concept'>
      <IconButton
        aria-label='scroll to concept'
        color='inherit'
        onClick={onScrollToConcept}
        size='small'
        sx={{ mr: 0.25 }}
      >
        <LuScrollText />
      </IconButton>
    </KBTooltipTarget>
  )
}

export default ConceptScroll
