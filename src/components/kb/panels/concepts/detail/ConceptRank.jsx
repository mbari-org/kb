import { use } from 'react'

import { Box, MenuItem, Select, FormControl, InputLabel } from '@mui/material'

import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import ApprovalButton from '@/components/kb/panels/concepts/detail/ApprovalButton'

import useUpdateTrigger from '@/components/hooks/useUpdateTrigger'

const ConceptRank = ({
  field,
  fieldValue,
  otherValue,
  inputStyle,
  onChange,
  showApprovalButton,
}) => {
  const { filterRanks } = use(TaxonomyContext)

  useUpdateTrigger('ConceptRank', {
    field,
    fieldValue,
    otherValue,
    inputStyle,
    onChange,
    showApprovalButton,
  })

  const rankOptions = filterRanks(field, otherValue)
  const label = field === 'rankName' ? 'Rank' : 'Level'

  return (
    <FormControl {...inputStyle}>
      <Box alignItems='center' display='flex' flexDirection='row' width='100%'>
        <Box display='flex' flexDirection='column' flexGrow={1}>
          <InputLabel id={`${field}-label`}>{label}</InputLabel>
          <Select displayEmpty labelId={`${field}-label`} onChange={onChange} value={fieldValue}
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
        {showApprovalButton && <ApprovalButton field={field} />}
      </Box>
    </FormControl>
  )
}

export default ConceptRank
