import { Stack } from '@mui/material'
import { IoChevronBack, IoChevronForward } from 'react-icons/io5'

import NavHistoryButton from './NavHistoryButton'

import CONFIG from '@/lib/config'

const { NEXT, PREVIOUS } = CONFIG.UI.NAV

const NavHistoryLinks = ({ history }) => {
  if (!history) return null
  const historyGoBack = delta => history.goBack(delta + 1)
  const historyGoForward = delta => history.goForward(delta + 1)

  return (
    <Stack direction='row'>
      <NavHistoryButton
        disabled={!history.canGoBack()}
        dropItems={history.backItems()}
        icon={IoChevronBack}
        label={PREVIOUS}
        onClick={history.back}
        onItemSelect={historyGoBack}
      />
      <NavHistoryButton
        disabled={!history.canGoForward()}
        dropItems={history.forwardItems()}
        icon={IoChevronForward}
        label={NEXT}
        onClick={history.forward}
        onItemSelect={historyGoForward}
      />
    </Stack>
  )
}

export default NavHistoryLinks
