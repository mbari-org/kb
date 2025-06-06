import { use } from 'react'

import { Box } from '@mui/material'
import { IoChevronBack, IoChevronForward } from 'react-icons/io5'

import PanelNavButton from './PanelNavButton'

import SelectedContext from '@/contexts/selected/SelectedContext'

const PanelNavLinks = () => {
  const { panels } = use(SelectedContext)

  return (
    <Box>
      <PanelNavButton
        disabled={!panels.canGoBack()}
        icon={IoChevronBack}
        label='previous panel'
        onClick={panels.back}
      />
      <PanelNavButton
        disabled={!panels.canGoForward()}
        icon={IoChevronForward}
        label='next panel'
        onClick={panels.forward}
      />
    </Box>
  )
}

export default PanelNavLinks
