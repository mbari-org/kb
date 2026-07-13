import { Box, Typography } from '@mui/material'
import KBTooltipTarget from '@/components/common/tooltip/KBTooltipTarget'

const PanelTitle = ({ subtitle, subtitleTooltip, title }) => {
  const subtitleContent = subtitle && (
    <Typography
      component='div'
      align='center'
      sx={{
        fontSize: '1rem',
        lineHeight: 1,
        mt: -0.55,
        width: '100%',
      }}
    >
      {subtitle}
    </Typography>
  )

  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
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
      <Box
        sx={{
          fontSize: '1rem',
          height: '1rem',
          width: '100%',
        }}
      >
        {subtitle && subtitleTooltip && (
          <KBTooltipTarget title={subtitleTooltip} wrapperSx={{ display: 'block', width: '100%' }}>
            {subtitleContent}
          </KBTooltipTarget>
        )}
        {subtitle && !subtitleTooltip && subtitleContent}
      </Box>
    </Box>
  )
}

export default PanelTitle
