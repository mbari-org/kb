import { Tooltip } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import PropTypes from 'prop-types'

import { DELAY, FONT } from '@/lib/tooltips'

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
            fontSize: FONT.SIZE,
            fontFamily: FONT.FAMILY,
            ...tooltipSx, // Allow custom styles to override defaults
          },
        },
      }}
      enterDelay={DELAY.onEnter}
      leaveDelay={DELAY.onLeave}
      title={title}
      {...props}
    >
      {children}
    </Tooltip>
  )
}

KBTooltip.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.node.isRequired,
  tooltipSx: PropTypes.object,
}

export default KBTooltip
