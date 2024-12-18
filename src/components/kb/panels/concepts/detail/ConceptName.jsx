import { use } from "react"

import { Typography } from "@mui/material"
import { useTheme } from "@mui/material/styles"

import ConceptContext from "@/contexts/concept/ConceptContext"
import TaxonomyContext from "@/contexts/taxonomy/TaxonomyContext"

const ConceptName = () => {
  const { concept: conceptTheme } = useTheme()

  const { concept } = use(ConceptContext)
  const { getPendingHistory } = use(TaxonomyContext)

  const hasPendingHistory = !!getPendingHistory(concept.name)

  const conceptColor = hasPendingHistory
    ? conceptTheme.pendingHistoryColor
    : conceptTheme.color

  return (
    <Typography
      variant="body1"
      component="div"
      sx={{
        fontFamily: conceptTheme.fontFamily,
        fontSize: conceptTheme.fontSize,
        fontWeight: conceptTheme.fontWeight,
        backgroundColor: "transparent",
        color: conceptColor,
      }}
    >
      {concept.name}
    </Typography>
  )
}

export default ConceptName
