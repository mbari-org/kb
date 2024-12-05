import { use } from "react"

import { TextField } from "@mui/material"
import { useTheme } from "@mui/material/styles"

import ConceptEditContext from "@/contexts/conceptEdit/ConceptEditContext"

const ConceptName = () => {
  const {
    conceptState: { name },
    editable,
    setConcept,
  } = use(ConceptEditContext)

  const { concept: conceptTheme, palette } = useTheme()

  const handleBlur = event => setConcept({ name: event.target.value })

  const handleChange = event => {
    if (editable) {
      setConcept({ name: event.target.value })
    }
  }
  const handleKeyDown = event => {
    if (event.key === "Enter") {
      setConcept({ name: event.target.value })
    }
  }

  return (
    <TextField
      disabled={!editable}
      onBlur={handleBlur}
      onChange={handleChange}
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
