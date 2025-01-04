import { useTheme } from "@mui/material/styles"
import { use } from "react"

import ConceptContext from "@/contexts/concept/ConceptContext"

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

const useConceptDetailStyle = _field => {
  const theme = useTheme()

  const { editing } = use(ConceptContext)

  const color = theme.palette.common.black

  const sx = {
    "& .MuiInputBase-input": {
      backgroundColor: theme.palette.primary.light,
      color,
      WebkitTextFillColor: color,
    },
    "& .MuiInputBase-input.Mui-disabled": {
      backgroundColor: "transparent",
      color,
      WebkitTextFillColor: color,
    },
  }

  if (editing) {
    return {
      ...editingStyle,
      sx: sx,
    }
  } else {
    return {
      ...standardStyle,
      sx: sx,
    }
  }
}

export default useConceptDetailStyle
