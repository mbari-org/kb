import { use, useMemo } from 'react'
import { Stack, Typography, Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'

import HistoryNavLinks from '@/components/common/HistoryNavLinks'

import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

const ConceptSelect = ({
  conceptName,
  disabled = false,
  handleConceptSelect,
  handleKeyUp,
  label = 'Concept',
  navigation = true,
  sx = {},
}) => {
  const theme = useTheme()

  const { concepts } = use(SelectedContext)
  const { getNames } = use(TaxonomyContext)

  const taxonomyNames = useMemo(() => getNames(), [getNames])

  return (
    <Stack spacing={0} sx={sx}>
      <Stack
        direction='row'
        justifyContent='space-between'
        alignItems='center'
        sx={{ minHeight: '40px' }}
      >
        <Typography
          sx={{
            color: disabled ? 'text.disabled' : 'text.primary',
            fontSize: theme => theme.typography.fontSize * 1.2,
            fontWeight: 'bold',
            ml: 1.5,
          }}
        >
          {label}
        </Typography>
        <Box sx={{ ml: -2, display: 'flex', alignItems: 'center' }}>
          {navigation && !disabled && <HistoryNavLinks history={concepts} />}
        </Box>
      </Stack>
      <Autocomplete
        disabled={disabled}
        onChange={handleConceptSelect}
        options={taxonomyNames}
        renderInput={params => (
          <TextField
            {...params}
            disabled={disabled}
            sx={{
              backgroundColor: disabled ? 'action.disabledBackground' : theme.palette.primary.pale,
              '& .MuiInputBase-input.Mui-disabled': {
                WebkitTextFillColor: theme.palette.text.disabled,
              },
            }}
            onKeyUp={event => handleKeyUp(event, taxonomyNames)}
          />
        )}
        size='small'
        slotProps={{
          paper: {
            sx: {
              '& .MuiAutocomplete-listbox': {
                '& .MuiAutocomplete-option': {
                  backgroundColor: theme.palette.primary.light,
                },
              },
            },
          },
        }}
        value={conceptName}
      />
      <hr />
    </Stack>
  )
}

export default ConceptSelect
