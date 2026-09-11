import { memo } from 'react'
import { Box } from '@mui/material'

const HEADER_HEIGHT = 100

const CONTAINER_SX = {
  alignItems: 'center',
  display: 'flex',
  height: HEADER_HEIGHT,
  ml: 1,
  mr: 1,
  mt: 2,
  position: 'relative',
}

const LEFT_SX = {
  left: 0,
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 1,
}

const TITLE_SX = {
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
  left: '50%',
  position: 'absolute',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  width: '60%',
}

const RIGHT_SX = {
  position: 'absolute',
  right: 0,
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 1,
}

const PanelHeader = ({ headerLeft, headerTitle, headerRight, sx = {} }) => {
  return (
    <Box sx={{ ...CONTAINER_SX, ...sx }}>
      <Box sx={LEFT_SX}>{headerLeft}</Box>

      <Box sx={TITLE_SX}>{headerTitle}</Box>

      <Box sx={RIGHT_SX}>{headerRight}</Box>
    </Box>
  )
}

export default memo(PanelHeader)
