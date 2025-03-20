import { Box, Typography } from '@mui/material'

import FieldValueDisplay from '@/components/common/FieldValueDisplay'

import ChildReset from './ChildReset'

import { fieldSx } from '@/components/common/format'

import { drop } from '@/lib/util'

const ChildAdd = ({ child }) => {
  const fields = drop(child, ['name'])
  const fieldValues = Object.entries(fields).reduce((acc, [field, value]) => {
    if (value) {
      acc.push([field, value])
    }
    return acc
  }, [])

  return (
    <Box
      sx={{
        alignItems: 'flex-start',
        display: 'flex',
        flexDirection: 'column',
        mt: 0.5,
      }}
    >
      <Box sx={{ alignItems: 'center', display: 'flex' }}>
        <ChildReset child={child} />
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={fieldSx}>Add:</Typography>
          <Typography sx={{ ...fieldSx, fontWeight: 'bold', ml: 1 }}>{child.name}</Typography>
        </Box>
      </Box>
      <Box sx={{ ml: 7 }}>
        {fieldValues.map(([field, value]) => (
          <FieldValueDisplay key={field} field={field} value={value} />
        ))}
      </Box>
    </Box>
  )
}

export default ChildAdd
