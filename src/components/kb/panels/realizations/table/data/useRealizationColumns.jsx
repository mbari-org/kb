import { Box, Link } from '@mui/material'

const useRealizationColumns = ({ onViewRealization }) => {
  const baseCellSx = {
    overflow: 'hidden',
    py: 1,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: '100%',
  }

  return [
    {
      field: 'linkName',
      flex: 0.15,
      headerClassName: 'bold-header',
      headerName: 'Link Name',
      renderCell: params => {
        const linkNameLabel = params.value?.trim() || 'View Realization'
        return (
          <Box sx={baseCellSx} title={linkNameLabel}>
            <Link
              component='button'
              onClick={() => onViewRealization(params.row)}
              sx={{ overflow: 'hidden', textAlign: 'left', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
              underline='hover'
            >
              {linkNameLabel}
            </Link>
          </Box>
        )
      },
    },
    {
      field: 'toConcept',
      flex: 0.2,
      headerClassName: 'bold-header',
      headerName: 'To Concept',
      renderCell: params => <Box sx={baseCellSx} title={params.value || ''}>{params.value || ''}</Box>,
    },
    {
      field: 'linkValue',
      flex: 0.65,
      headerClassName: 'bold-header',
      headerName: 'Link Value',
      renderCell: params => <Box sx={baseCellSx} title={params.value || ''}>{params.value || ''}</Box>,
    },
  ]
}

export default useRealizationColumns
