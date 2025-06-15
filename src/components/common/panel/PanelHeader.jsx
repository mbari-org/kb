import { Box, Typography } from '@mui/material'
import PropTypes from 'prop-types'

const HEADER_HEIGHT = 120

/**
 * A header component for panels that provides a consistent layout with left, center, and right sections.
 * The title is centered both vertically and horizontally, independent of the left and right sections.
 * The title will take up 90% of the remaining space between the left and right components.
 * @param {Object} props
 * @param {React.ReactNode} props.headerLeft - Optional content for the left section
 * @param {React.ReactNode} props.headerTitle - Content for the centered title
 * @param {React.ReactNode} props.headerRight - Optional content for the right section
 * @param {Object} props.sx - Additional styles to be applied to the header container
 */
const PanelHeader = ({ headerLeft, headerTitle, headerRight, sx = {} }) => {
  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        height: HEADER_HEIGHT,
        ml: 2,
        mr: 2,
        position: 'relative',
        ...sx,
      }}
    >
      <Box
        sx={{
          left: 0,
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1,
        }}
      >
        {headerLeft}
      </Box>

      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center',
          left: 0,
          position: 'absolute',
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      >
        <Typography
          sx={{
            overflow: 'hidden',
            textAlign: 'center',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            width: '90%',
          }}
        >
          {headerTitle}
        </Typography>
      </Box>

      <Box
        sx={{
          position: 'absolute',
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1,
        }}
      >
        {headerRight}
      </Box>
    </Box>
  )
}

PanelHeader.propTypes = {
  headerLeft: PropTypes.node,
  headerTitle: PropTypes.node.isRequired,
  headerRight: PropTypes.node,
  sx: PropTypes.object,
}

export default PanelHeader
