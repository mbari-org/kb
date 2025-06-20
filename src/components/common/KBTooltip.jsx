import { Tooltip } from '@mui/material'
import PropTypes from 'prop-types'

import { DELAY } from '@/lib/tooltips'

/**
 * KBTooltip component - a wrapper around MUI Tooltip with consistent styling and behavior
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The element that triggers the tooltip
 * @param {string} props.title - The tooltip content (required)
 * @param {...Object} props - All other props are passed through to MUI Tooltip
 */
const KBTooltip = ({ children, title, ...props }) => {
  return (
    <Tooltip enterDelay={DELAY.onEnter} leaveDelay={DELAY.onLeave} title={title} {...props}>
      {children}
    </Tooltip>
  )
}

KBTooltip.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.node.isRequired,
}

export default KBTooltip
