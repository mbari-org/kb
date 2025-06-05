import { use } from 'react'

import { Box } from '@mui/material'
import { IoChevronBack, IoChevronForward } from 'react-icons/io5'

import PanelNavButton from './PanelNavButton'

import SelectedContext from '@/contexts/selected/SelectedContext'

const PanelNavLinks = () => {
  const { panel } = use(SelectedContext)

  return (
    <Box>
      <PanelNavButton
        disabled={!panel.canGoBack()}
        icon={IoChevronBack}
        label='previous panel'
        onClick={panel.back}
      />
      <PanelNavButton
        disabled={!panel.canGoForward()}
        icon={IoChevronForward}
        label='next panel'
        onClick={panel.forward}
      />
    </Box>
  )
}

export default PanelNavLinks
