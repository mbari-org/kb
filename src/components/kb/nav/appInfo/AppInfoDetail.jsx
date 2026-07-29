import { Box, Typography } from '@mui/material'
import { CiEdit } from 'react-icons/ci'

import ActionIcon from '@/components/icon/ActionIcon'

import CONFIG from '@/lib/config'

const AppInfoDetail = ({ editTooltip, label, onEdit, value }) => {
  const hasEditAction = typeof onEdit === 'function'

  const fontWeight = value !== CONFIG.APP_INFO.BASE_URL.NONE ? 'bold' : 'normal'
  const fontStyle = value !== CONFIG.APP_INFO.BASE_URL.NONE ? 'normal' : 'italic'

  return (
    <Box sx={{ display: 'flex', mb: 1 }}>
      <Box sx={{ alignItems: 'center', display: 'flex', width: 200, flexShrink: 0 }}>
        <Box sx={{ width: 20, mr: 1, lineHeight: 0 }}>
          {hasEditAction && (
            <ActionIcon
              asDiv
              color='edit'
              Icon={CiEdit}
              onClick={onEdit}
              size={20}
              sx={{ lineHeight: 0, p: 0 }}
              tooltip={editTooltip || `Edit ${label}`}
            />
          )}
        </Box>
        <Typography>{label}:</Typography>
      </Box>
      <Typography sx={{ fontStyle, fontWeight }}>{value}</Typography>
    </Box>
  )
}

export default AppInfoDetail
