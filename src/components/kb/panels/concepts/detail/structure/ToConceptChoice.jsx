import { use, useMemo } from 'react'
import { useTheme } from '@mui/material/styles'
import { Stack, Typography, Autocomplete, TextField, Divider } from '@mui/material'

import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

const ToConceptChoice = ({
  handleChange,
  handleKeyUp,
  initialValue,
  label,
  omitChoices,
  value,
}) => {
  const theme = useTheme()
  const { getNames } = use(TaxonomyContext)

  const optionNames = useMemo(() => {
    return getNames().filter(name => !omitChoices.includes(name))
  }, [getNames, omitChoices])

  return (
    <Stack direction='row' spacing={2} alignItems='center'>
      <Typography minWidth={60}>{label}:</Typography>
      <Autocomplete
        onChange={handleChange}
        options={optionNames}
        renderInput={params => (
          <TextField
            {...params}
            fullWidth
            onKeyUp={handleKeyUp}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
              '& input': {
                color: theme.concept.color.edit,
                fontSize: theme.concept.updateFontSize,
                fontFamily: theme.concept.fontFamily,
                fontWeight: theme.concept.fontWeight,
              },
              '&:after': {
                borderBottom: `2px solid ${theme.palette.primary.main}`,
                content: '""',
              },
              '&:before': {
                border: 'none',
                content: '""',
              },
              border: 'none',
              fontSize: theme.concept.updateFontSize,
              fontFamily: theme.concept.fontFamily,
              fontWeight: theme.concept.fontWeight,
              ml: -2,
            }}
            value={value}
          />
        )}
        size='small'
        value={value}
        sx={{ width: '500px' }}
      />
      <Divider sx={{ marginTop: 1 }} />
    </Stack>
  )
}

export default ToConceptChoice
