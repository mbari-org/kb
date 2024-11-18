import { use } from "react"

import { Typography } from "@mui/material"
import { useTheme } from "@mui/material/styles"

import ConceptContext from "@/contexts/concept/ConceptContext"

const ConceptName = () => {
  const {
    conceptState: { name },
  } = use(ConceptContext)

  const { concept: conceptTheme } = useTheme()
  return (
    <Typography
      sx={{
        color: conceptTheme.color,
        fontFamily: conceptTheme.fontFamily,
        fontSize: conceptTheme.fontSize,
        fontWeight: conceptTheme.fontWeight,
      }}
    >
      {name.toUpperCase()}
    </Typography>
  )
}

export default ConceptName