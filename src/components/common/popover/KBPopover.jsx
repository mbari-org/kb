import { useState } from 'react'
import { Box, Popover } from '@mui/material'

/**
 * KBPopover component - click-triggered popover for interactive content
 *
 * Use this instead of KBTooltip when the content contains actionable elements
 * (links, buttons). Click-triggered so it works on touch devices and stays
 * open while the user interacts with the content.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The element that opens the popover on click
 * @param {React.ReactNode|Function} props.content - Popover body; pass a function to receive { close }
 * @param {Object} props.anchorOrigin - MUI Popover anchorOrigin override
 * @param {Object} props.transformOrigin - MUI Popover transformOrigin override
 * @param {Object} props.wrapperSx - Custom styles for the trigger wrapper
 * @param {Object} props.paperSx - Custom styles for the popover paper
 * @param {...Object} props - All other props are passed through to MUI Popover
 */
const KBPopover = ({
  children,
  content,
  anchorOrigin = { vertical: 'bottom', horizontal: 'left' },
  transformOrigin = { vertical: 'top', horizontal: 'left' },
  wrapperSx = {},
  paperSx = {},
  ...popoverProps
}) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const open = event => setAnchorEl(event.currentTarget)
  const close = () => setAnchorEl(null)

  return (
    <>
      <Box component='span' sx={{ display: 'inline-flex', cursor: 'pointer', ...wrapperSx }} onClick={open}>
        {children}
      </Box>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={close}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
        slotProps={{ paper: { sx: { p: 2, ...paperSx } } }}
        {...popoverProps}
      >
        {typeof content === 'function' ? content({ close }) : content}
      </Popover>
    </>
  )
}

export default KBPopover
