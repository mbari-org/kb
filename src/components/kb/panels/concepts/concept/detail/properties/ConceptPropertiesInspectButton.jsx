import { Box } from '@mui/material'
import { FaRegEye } from 'react-icons/fa'

import KBTooltip from '@/components/common/KBTooltip'

const ConceptPropertiesInspect = ({ onClick, tooltip, size = 18 }) => {
  const icon = <FaRegEye size={size} />

  const inspectElement = (
    <Box
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4px',
        borderRadius: '50%',
        '&:hover': {
          color: 'primary.main',
          '& svg': {
            transform: 'scale(1.2)',
          },
        },
      }}
    >
      {icon}
    </Box>
  )

  if (tooltip) {
    return (
      <KBTooltip title={tooltip} placement='top'>
        {inspectElement}
      </KBTooltip>
    )
  }

  return inspectElement
}

export default ConceptPropertiesInspect
