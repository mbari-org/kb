import IconButton from '@mui/material/IconButton'
import { LuScrollText } from 'react-icons/lu'
import KBTooltipTarget from '@/components/common/tooltip/KBTooltipTarget'

import CONFIG from '@/lib/config'

const { ARIA_LABEL, TOOLTIP } = CONFIG.UI.CONCEPT_SCROLL

const ConceptScroll = ({ onScrollToConcept }) => {
  return (
    <KBTooltipTarget title={TOOLTIP}>
      <IconButton
        aria-label={ARIA_LABEL}
        color='primary'
        onClick={onScrollToConcept}
        size='small'
        sx={{ display: 'none', mr: 0.25 }}
      >
        <LuScrollText />
      </IconButton>
    </KBTooltipTarget>
  )
}

export default ConceptScroll
