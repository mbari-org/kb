import { Box } from '@mui/material'

import { RESETTING } from '@/lib/constants.js'

const StagedItem = ({ ItemDetail, ItemHeader, ItemReset, resetting }) => {
  const disabled = resetting === RESETTING.EXTENT.OTHER

  return (
    <Box sx={{ opacity: disabled ? 0.5 : 1 }}>
      <Box sx={{ alignItems: 'center', display: 'flex' }}>
        <ItemReset resetting={resetting} />
        <ItemHeader resetting={resetting} />
      </Box>
      <Box sx={{ ml: 6 }}>
        <ItemDetail resetting={resetting} />
      </Box>
    </Box>
  )
}

export default StagedItem
