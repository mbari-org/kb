import { Box } from '@mui/material'

const StagedItem = ({ disabled, ItemDetail, ItemHeader, ItemReset }) => {
  return (
    <Box sx={{ opacity: disabled ? 0.5 : 1 }}>
      <Box sx={{ alignItems: 'center', display: 'flex' }}>
        <ItemReset />
        <ItemHeader />
      </Box>
      <Box sx={{ ml: 6 }}>
        <ItemDetail />
      </Box>
    </Box>
  )
}

export default StagedItem
