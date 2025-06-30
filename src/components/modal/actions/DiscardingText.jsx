import { Box } from '@mui/material'

import ActionsText from './ActionsText'

const DiscardingText = () => (
  <Box>
    <ActionsText text='Discarding edits is final.' />
    <ActionsText text='Please confirm you want to discard the indicated edits.' />
  </Box>
)

export default DiscardingText
