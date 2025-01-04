import { useTheme } from "@mui/material/styles"
import { use } from "react"

import ConceptContext from "@/contexts/concept/ConceptContext"
import TaxonomyContext from "@/contexts/taxonomy/TaxonomyContext"

import { isEmpty } from "@/lib/util"

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

  const { concept, editing } = use(ConceptContext)
  const { getConceptPendingHistory } = use(TaxonomyContext)

  const hasPendingHistory = !isEmpty(
    getConceptPendingHistory(concept?.name, field)
  )

  const textColor = hasPendingHistory
    ? theme.concept.color.pending
    : theme.palette.common.black
  // : theme.concept.color.detail

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
