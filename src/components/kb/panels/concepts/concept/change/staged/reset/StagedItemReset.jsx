import { Box } from '@mui/material'

import ResettingButton from '@/components/kb/panels/concepts/concept/change/staged/reset/ResettingButton'

import useOnReset from './useOnReset'

const StagedItemReset = ({ group, resetting, stagedItem }) => {
  const { index } = stagedItem

  const onClick = useOnReset(group, index)

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <ResettingButton color='cancel' onClick={onClick} resetting={resetting} />
    </Box>
  )
}

export default StagedItemReset
