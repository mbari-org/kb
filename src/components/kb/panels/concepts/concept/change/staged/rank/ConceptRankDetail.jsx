import { use } from 'react'

import { Box, MenuItem, Select, FormControl, InputLabel } from '@mui/material'

import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import useStagedFieldBorder from '@/components/kb/panels/concepts/concept/change/staged/field/useStagedFieldBorder'

const ConceptRankDetail = ({ field, fieldValue, otherValue, inputStyle, onChange }) => {
  const { filterRanks } = use(TaxonomyContext)

  const rankOptions = filterRanks(field, otherValue)

  const label = field.replace(/^rank/, 'Rank ')

  const border = useStagedFieldBorder(field)

  return (
    <FormControl {...inputStyle}>
      <Box alignItems='center' display='flex' flexDirection='row' width='100%'>
        <Box display='flex' flexDirection='column' flexGrow={1} sx={{ ...border }}>
          <InputLabel id={`${field}-label`}>{label}</InputLabel>
          <Select
            displayEmpty
            labelId={`${field}-label`}
            onChange={onChange}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderTop: 'none',
                borderLeft: 'none',
                borderRight: 'none',
              },
            }}
            value={fieldValue || ''}
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

export default ConceptRankDetail
