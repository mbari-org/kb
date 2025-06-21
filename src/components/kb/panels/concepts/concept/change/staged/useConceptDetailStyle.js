import { useTheme } from '@mui/material/styles'
import { use, useMemo } from 'react'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import useConceptPending from '@/contexts/panels/concepts/pending/useConceptPending'

import { hasPending } from '@/lib/kb/model/history'

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

  const { concept, editing } = use(ConceptContext)

  const conceptPending = useConceptPending(concept.name)

  const fieldHasPending = hasPending(conceptPending, field)

  const textColor = fieldHasPending ? theme.concept.color.pending : theme.palette.common.black

  const fontWeight = fieldHasPending ? 'bold' : 'normal'

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

  if (!editing || fieldHasPending) {
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
