import { Tooltip } from '@mui/material'
import { useTheme } from '@mui/material/styles'

const TOOLTIP = {
  DELAY: {
    onEnter: 500,
    onLeave: 0,
  },
  FONT: {
    SIZE: '1em',
    FAMILY: 'Arial, sans-serif',
  },
}

/**
 * KBTooltip component - a wrapper around MUI Tooltip with consistent styling and behavior
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The element that triggers the tooltip
 * @param {string} props.title - The tooltip content (required)
 * @param {Object} props.tooltipSx - Custom styles to override default tooltip styling
 * @param {...Object} props - All other props are passed through to MUI Tooltip
 */
const KBTooltip = ({ children, title, tooltipSx, ...props }) => {
  const theme = useTheme()

  return (
    <Tooltip
      slotProps={{
        tooltip: {
          sx: {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.grey[200],
            fontSize: TOOLTIP.FONT.SIZE,
            fontFamily: TOOLTIP.FONT.FAMILY,
            ...tooltipSx, // Allow custom styles to override defaults
          },
        },
      }}
      enterDelay={TOOLTIP.DELAY.onEnter}
      leaveDelay={TOOLTIP.DELAY.onLeave}
      disableInteractive={true}
      title={title}
      {...props}
    >
      {children}
    </Tooltip>
  )
}

export default KBTooltip
