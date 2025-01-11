import { useTheme } from "@mui/material/styles"
import { use } from "react"

import ConceptContext from "@/contexts/concept/ConceptContext"

import { isEmpty } from "@/lib/kb/util"

const baseStyle = {
  fullWidth: true,
  size: "small",
}

const editingStyle = {
  ...baseStyle,
  disabled: false,
  variant: "filled",
}

const standardStyle = {
  ...baseStyle,
  disabled: true,
  variant: "standard",
}

const useConceptDetailStyle = field => {
  const theme = useTheme()

  const { editing, pendingHistory } = use(ConceptContext)

  const hasPendingHistory = !isEmpty(
    pendingHistory.filter(pending => pending.field === field)
  )

  const textColor = hasPendingHistory
    ? theme.concept.color.pending
    : theme.palette.common.black

  const sx = {
    "& .MuiInputBase-input": {
      backgroundColor: theme.palette.primary.light,
      color: textColor,
      WebkitTextFillColor: textColor,
    },
    "& .MuiInputBase-input.Mui-disabled": {
      backgroundColor: "transparent",
      color: textColor,
      WebkitTextFillColor: textColor,
    },
  }

  if (!editing || hasPendingHistory) {
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
