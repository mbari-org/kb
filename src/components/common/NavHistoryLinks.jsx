import { Stack } from '@mui/material'
import { IoChevronBack, IoChevronForward } from 'react-icons/io5'

import NavHistoryButton from './NavHistoryButton'

const NavHistoryLinks = ({ history }) => {
  const historyGoBack = delta => history.goBack(delta + 1)
  const historyGoForward = delta => history.goForward(delta + 1)

  return (
    <Stack direction='row'>
      <NavHistoryButton
        disabled={!history.canGoBack()}
        dropItems={history.backItems()}
        icon={IoChevronBack}
        label='previous'
        onClick={history.back}
        onItemSelect={historyGoBack}
      />
      <NavHistoryButton
        disabled={!history.canGoForward()}
        dropItems={history.forwardItems()}
        icon={IoChevronForward}
        label='next'
        onClick={history.forward}
        onItemSelect={historyGoForward}
      />
    </Stack>
  )
}

export default NavHistoryLinks
