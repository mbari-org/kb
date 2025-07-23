import { Box } from '@mui/material'

import ResettingButton from '@/components/kb/panels/concepts/concept/change/staged/reset/ResettingButton'

import useOnReset from './useOnReset'

const StagedGroupReset = ({ group, resetting }) => {
  const onClick = useOnReset(group)

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <ResettingButton color='cancel' onClick={onClick} resetting={resetting} />
    </Box>
  )
}

export default StagedGroupReset
