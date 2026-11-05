import { useTheme } from '@mui/material/styles'
import { use, useMemo } from 'react'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { hasPending } from '@/lib/model/history'

import { PENDING } from '@/lib/constants/pending.js'

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

  const { isEditing, pending } = use(ConceptContext)

  const pendingConcept = pending(PENDING.DATA.CONCEPT)

  const fieldHasPending = hasPending(pendingConcept, field)

  const textColor = fieldHasPending ? theme.concept.color.pending : theme.palette.common.black

  const fontWeight = fieldHasPending ? 'bold' : 'normal'

  const sx = useMemo(
    () => ({
      '& .MuiInputBase-input': {
        color: textColor,
        fontWeight: fontWeight,
        WebkitTextFillColor: textColor,
      },
      '& .MuiInputBase-input.Mui-disabled': {
        color: textColor,
        WebkitTextFillColor: textColor,
      },
    }),
    [fontWeight, textColor]
  )

  if (!isEditing || fieldHasPending) {
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
