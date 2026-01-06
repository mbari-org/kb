import { use } from 'react'

import { Box, MenuItem, Select, FormControl, InputLabel } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import useConceptDetailStyle from '@/components/kb/panels/concepts/concept/change/staged/useConceptDetailStyle'

import { stagedBorder } from '@/lib/concept/state/staged'

import { CONCEPT } from '@/lib/constants'

import { rankField } from '@/lib/concept/state/rank'

const RankFieldInput = ({ field, initialRank, label, rank, onChange }) => {
  const theme = useTheme()

  const inputStyle = useConceptDetailStyle(field)
  const { filterRanks } = use(TaxonomyContext)

  const rankValue = field => (rank[field] !== undefined ? rank[field] : initialRank[field])

  const fieldValue = rankValue(field)
  const otherValue =
    field === CONCEPT.RANK.NAME ? rankValue(CONCEPT.RANK.LEVEL) : rankValue(CONCEPT.RANK.NAME)

  const rankOptions = filterRanks(rankField(field), otherValue)

  const border = stagedBorder({
    noActionBorderColor: 'none',
    stagedItem: rank,
    theme,
    width: '2px',
  })

  return (
    <FormControl {...inputStyle}>
      <Box alignItems='center' display='flex' flexDirection='row' width='100%'>
        <Box display='flex' flexDirection='column' flexGrow={1} sx={{ border }}>
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

export default RankFieldInput
