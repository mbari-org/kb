import { Box } from '@mui/material'
import PropTypes from 'prop-types'

/**
 * A header component for panel tables that provides a consistent layout with left and right sections.
 * @param {Object} props
 * @param {React.ReactNode} props.headerLeft - Content for the left section
 * @param {React.ReactNode} props.headerRight - Content for the right section
 * @param {Object} props.sx - Additional styles to be applied to the header container
 */
const PanelTableHeader = ({ headerLeft, headerRight, sx = {} }) => {
  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'space-between',
        pb: 1,
        pl: 1,
        pr: 1,
        ...sx,
      }}
    >
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          minWidth: 0,
        }}
      >
        {headerLeft}
      </Box>

      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          minWidth: 0,
        }}
      >
        {headerRight}
      </Box>
    </Box>
  )
}

PanelTableHeader.propTypes = {
  headerLeft: PropTypes.node.isRequired,
  headerRight: PropTypes.node.isRequired,
  sx: PropTypes.object,
}

export default PanelTableHeader
