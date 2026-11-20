import { Box } from '@mui/material'

/**
 * A header component for panel tables that provides a consistent layout with left, middle, and right sections.
 * @param {Object} props
 * @param {React.ReactNode} props.headerLeft - Content for the left section
 * @param {React.ReactNode} props.headerMiddle - Content for the middle section (optional)
 * @param {React.ReactNode} props.headerRight - Content for the right section
 * @param {Object} props.sx - Additional styles to be applied to the header container
 */
const PanelTableHeader = ({ headerLeft, headerMiddle, headerRight, sx = {} }) => {
  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'space-between',
        pb: 1,
        pl: 1,
        pr: 1,
        position: 'relative',
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

      {headerMiddle && (
        <Box
          sx={{
            alignItems: 'center',
            bottom: theme => theme.spacing(1),
            display: 'flex',
            left: '50%',
            minWidth: 0,
            position: 'absolute',
            transform: 'translateX(-50%)',
          }}
        >
          {headerMiddle}
        </Box>
      )}

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

export default PanelTableHeader
