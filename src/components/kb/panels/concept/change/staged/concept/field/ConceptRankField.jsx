import { use } from 'react'
import { alpha, useTheme } from '@mui/material/styles'

import { Box, MenuItem, Select, FormControl, InputLabel } from '@mui/material'

import ConceptContext from '@/contexts/concept/ConceptContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { updateInfo } from '@/contexts/concept/staged/edit/stateUpdates'

const ConceptRankField = ({ field, fieldValue, otherValue, inputStyle, onChange }) => {
  const theme = useTheme()

  const { initialState, stagedState } = use(ConceptContext)
  const { filterRanks } = use(TaxonomyContext)

  const { hasUpdated } = updateInfo(initialState, stagedState)

  const rankOptions = filterRanks(field, otherValue)
  const label = field === 'rankName' ? 'Rank' : 'Level'

  return (
    <FormControl
      {...inputStyle}
      sx={{
        backgroundColor: hasUpdated(field)
          ? alpha(theme.palette.edit.light, 0.2)
          : theme.palette.primary.light,
        borderRadius: 1,
        '& .MuiOutlinedInput-root': {
          backgroundColor: 'transparent',
        },
      }}
    >
      <Box alignItems='center' display='flex' flexDirection='row' width='100%'>
        <Box display='flex' flexDirection='column' flexGrow={1}>
          <InputLabel id={`${field}-label`}>{label}</InputLabel>
          <Select
            displayEmpty
            labelId={`${field}-label`}
            onChange={onChange}
            value={fieldValue}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderTop: 'none',
                borderLeft: 'none',
                borderRight: 'none',
              },
            }}
          >
            {rankOptions.map(option => (
              <MenuItem key={option} sx={{ height: '1.75em' }} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>
    </FormControl>
  )
}

export default ConceptRankField
