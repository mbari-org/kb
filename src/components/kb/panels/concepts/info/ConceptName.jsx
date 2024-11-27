import { use } from "react"

import { TextField } from "@mui/material"
import { useTheme } from "@mui/material/styles"

import ConceptContext from "@/contexts/concept/ConceptContext"

const ConceptName = () => {
  const {
    conceptState: { name },
    editable,
    setConcept,
  } = use(ConceptContext)

  const { concept: conceptTheme, palette } = useTheme()

  const handleBlur = event => setConcept({ name: event.target.value })

  const handleKeyDown = event => {
    if (event.key === "Enter") {
      setConcept({ name: event.target.value })
    }
  }

  return (
    <TextField
      disabled={!editable}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      slotProps={{
        input: {
          sx: {
            fontFamily: conceptTheme.fontFamily,
            fontSize: conceptTheme.fontSize,
            fontWeight: conceptTheme.fontWeight,
            cursor: editable ? "text" : "pointer",
            "& .MuiInputBase-input": {
              backgroundColor: palette.primary.light,
              color: palette.grey[700],
            },
            "& .MuiInputBase-input.Mui-disabled": {
              backgroundColor: "transparent",
              WebkitTextFillColor: conceptTheme.color,
            },
          },
        },
      }}
      value={name}
      variant="standard"
    />
  )
}

export default ConceptName
