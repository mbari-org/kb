import { use, useEffect, useState } from 'react'
import { Autocomplete, Stack, TextField, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import { CONCEPT } from '@/lib/constants'
import useDebounce from '@/lib/hooks/useDebounce'
import ReferencesContext from '@/contexts/panels/references/ReferencesContext'

const { WIDTH } = CONCEPT.SELECT

const ReferencesHeaderRight = () => {
  const theme = useTheme()
  const { citationGlob, setCitationGlob } = use(ReferencesContext)
  const [citationInput, setCitationInput] = useState(citationGlob)
  const debouncedSetCitationGlob = useDebounce(setCitationGlob)

  useEffect(() => {
    setCitationInput(citationGlob)
  }, [citationGlob])

  useEffect(() => {
    debouncedSetCitationGlob(citationInput)
  }, [citationInput, debouncedSetCitationGlob])

  return (
    <Stack spacing={0} sx={{ width: WIDTH }}>
      <Stack direction='row' sx={{ alignItems: 'center', minHeight: '40px' }}>
        <Typography
          sx={{
            fontSize: theme => theme.typography.fontSize * 1.2,
            fontWeight: 'bold',
            ml: 1.5,
          }}
        >
          Citation Filter
        </Typography>
      </Stack>
      <Autocomplete
        freeSolo
        inputValue={citationInput}
        onInputChange={(_event, value) => setCitationInput(value)}
        options={[]}
        renderInput={params => (
          <TextField
            {...params}
            sx={{
              backgroundColor: theme.palette.primary.pale,
            }}
          />
        )}
        size='small'
      />
    </Stack>
  )
}

export default ReferencesHeaderRight
