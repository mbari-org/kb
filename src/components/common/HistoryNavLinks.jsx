import { Stack } from '@mui/material'
import { IoChevronBack, IoChevronForward } from 'react-icons/io5'

import HistoryNavButton from './HistoryNavButton'

const HistoryNavLinks = ({ history }) => {
  return (
    <Stack direction='row'>
      <HistoryNavButton
        disabled={!history.canGoBack()}
        icon={IoChevronBack}
        label='previous'
        onClick={history.back}
      />
      <HistoryNavButton
        disabled={!history.canGoForward()}
        icon={IoChevronForward}
        label='next'
        onClick={history.forward}
      />
    </Stack>
  )
}

export default HistoryNavLinks
