import { Box } from '@mui/material'

import StagedGroupReset from '@/components/kb/panels/concepts/concept/change/staged/reset/StagedGroupReset'

const StagedGroup = ({ group, GroupBody, GroupHeader, initial, resetting }) => {
  return (
    <Box
      sx={{
        alignItems: 'flex-start',
        display: 'flex',
        flexDirection: 'column',
        mt: 0.5,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <StagedGroupReset group={group} initial={initial} resetting={resetting} />
        <GroupHeader />
      </Box>
      <GroupBody />
    </Box>
  )
}

export default StagedGroup
