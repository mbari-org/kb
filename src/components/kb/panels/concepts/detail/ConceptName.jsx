import { use } from "react"
import { CiEdit } from "react-icons/ci"

import { Button, Stack, Typography } from "@mui/material"
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
    <Stack direction="row" alignItems="center">
      <Typography
        component="div"
        sx={{
          fontFamily: conceptTheme.fontFamily,
          fontSize: conceptTheme.fontSize,
          fontWeight: conceptTheme.fontWeight,
          backgroundColor: "transparent",
          color: conceptColor,
        }}
        variant="body1"
      >
        {concept.name}
      </Typography>
      <Button
        startIcon={<CiEdit size={28} />}
        sx={{
          mb: 2,
          ml: 1.5,
          minWidth: "auto",
          padding: "0",
        }}
        onClick={() => console.log("Edit button clicked")}
      />
    </Stack>
  )
}

export default ConceptName
