import { use } from 'react'

import { Autocomplete, Box, FormControl, TextField } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'
import UserContext from '@/contexts/user/UserContext'

import useConceptDetailStyle from '@/components/kb/panels/concepts/concept/change/staged/useConceptDetailStyle'

import { stagedBorder } from '@/lib/concept/state/staged'

import { CONCEPT } from '@/lib/constants'
import CONFIG from '@/lib/config'

import { rankField } from '@/lib/concept/state/rank'

const RankFieldInput = ({ field, initialRank, label, rank, onChange, onClear }) => {
  const theme = useTheme()

  const inputStyle = useConceptDetailStyle(field)
  const { filterRanks } = use(TaxonomyContext)
  const { isAdmin } = use(UserContext)

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

  const clearLabel =
    field === CONCEPT.RANK.NAME ? CONFIG.PANELS.CONCEPTS.RANK.CLEAR.NAME : CONFIG.PANELS.CONCEPTS.RANK.CLEAR.LEVEL

  const handleChange = (_event, value) => {
    if (value === null) {
      onClear?.()
      return
    }
    onChange({ target: { value } })
  }

  const { disabled, variant } = inputStyle

  return (
    <FormControl {...inputStyle}>
      <Box sx={{ border, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <Autocomplete
          clearText={clearLabel}
          disableClearable={!isAdmin || !onClear}
          disabled={disabled}
          onChange={handleChange}
          options={rankOptions}
          renderInput={params => <TextField {...params} label={label} variant={variant} />}
          size='small'
          value={fieldValue || null}
        />
      </Box>
    </FormControl>
  )
}

export default RankFieldInput
