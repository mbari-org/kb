import { use } from "react"

import { TextField } from "@mui/material"
import { useTheme } from "@mui/material/styles"

import ConceptContext from "@/contexts/concept/ConceptContext"

const ConceptName = () => {
  const {
    conceptState: { name },
    editing,
    updateConcept,
  } = use(ConceptContext)

  const { concept: conceptTheme, palette } = useTheme()

  const handleBlur = event => updateConcept({ name: event.target.value })

  const handleChange = event => {
    if (editing) {
      updateConcept({ name: event.target.value })
    }
  }
  const handleKeyDown = event => {
    if (event.key === "Enter") {
      updateConcept({ name: event.target.value })
    }
  }

  return (
    <TextField
      disabled={!editing}
      onBlur={handleBlur}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      slotProps={{
        input: {
          sx: {
            fontFamily: conceptTheme.fontFamily,
            fontSize: conceptTheme.fontSize,
            fontWeight: conceptTheme.fontWeight,
            cursor: editing ? "text" : "pointer",
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
