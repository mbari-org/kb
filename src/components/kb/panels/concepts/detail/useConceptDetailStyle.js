import { useTheme } from '@mui/material/styles'
import { use, useMemo } from 'react'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { hasPendingHistory } from '@/lib/kb/model/history'

const baseStyle = {
  fullWidth: true,
  size: 'small',
}

const editingStyle = {
  ...baseStyle,
  disabled: false,
  variant: 'filled',
}

const standardStyle = {
  ...baseStyle,
  disabled: true,
  variant: 'standard',
}

const useConceptDetailStyle = field => {
  const theme = useTheme()

  const { editing, pendingHistory } = use(ConceptContext)

  const fieldHasPendingHistory = hasPendingHistory(pendingHistory, field)

  const textColor = fieldHasPendingHistory
    ? theme.concept.color.pending
    : theme.palette.common.black

  const fontWeight = fieldHasPendingHistory ? 'bold' : 'normal'

  const sx = useMemo(
    () => ({
      '& .MuiInputBase-input': {
        backgroundColor: theme.palette.primary.light,
        color: textColor,
        fontWeight: fontWeight,
        WebkitTextFillColor: textColor,
      },
      '& .MuiInputBase-input.Mui-disabled': {
        backgroundColor: 'transparent',
        color: textColor,
        WebkitTextFillColor: textColor,
      },
    }),
    [fontWeight, theme, textColor]
  )

  if (!editing || fieldHasPendingHistory) {
    return {
      ...standardStyle,
      sx: sx,
    }
  }

  return {
    ...editingStyle,
    sx: sx,
  }
}

export default useConceptDetailStyle
