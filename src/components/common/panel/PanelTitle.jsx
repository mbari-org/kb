import { Box, Typography } from '@mui/material'

import KBTooltip from '@/components/common/KBTooltip'

const PanelTitle = ({ subtitle, subtitleTooltip, title }) => {
  const subtitleContent = subtitle && (
    <Typography
      component='div'
      align='center'
      sx={{
        fontSize: '1rem',
        width: '100%',
      }}
    >
      {subtitle}
    </Typography>
  )

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mt: -2,
        overflow: 'hidden',
        textAlign: 'center',
        width: '100%',
      }}
    >
      <Typography
        component='div'
        align='center'
        sx={{
          fontSize: '2.25rem',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          width: '100%',
        }}
      >
        {title}
      </Typography>
      {subtitle && subtitleTooltip && (
        <KBTooltip title={subtitleTooltip}>
          {subtitleContent}
        </KBTooltip>
      )}
      {subtitle && !subtitleTooltip && subtitleContent}
    </Box>
  )
}

export default PanelTitle
