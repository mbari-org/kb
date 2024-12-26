import { use } from "react"

import { Box, TextField, Typography } from "@mui/material"
import { useTheme } from "@mui/material/styles"

import ConceptContext from "@/contexts/concept/ConceptContext"
import TaxonomyContext from "@/contexts/taxonomy/TaxonomyContext"

const AlertContentConceptNameUpdate = () => {
  const { concept: conceptTheme, palette } = useTheme()

  const { concept, conceptState, conceptUpdate } = use(ConceptContext)
  const { getConceptNames, getPendingHistory } = use(TaxonomyContext)

  const names = getConceptNames()

  const fromColor = getPendingHistory(concept.name)
    ? conceptTheme.color.pending
    : conceptTheme.color.detail

  // const fromColor =

  const toColor =
    conceptState.name === concept.name || names.includes(conceptState.name)
      ? palette.grey[500]
      : palette.primary.main

  const handleChange = event => {
    conceptUpdate({ name: event.target.value })
  }

  return (
    <>
      <Box>
        <Box display="flex" flexDirection="column" sx={{ mt: 2, ml: 3, mb: 2 }}>
          <Box display="flex" alignItems="center">
            <Typography minWidth={60}>From:</Typography>
            <Typography
              color={fromColor}
              fontFamily={conceptTheme.fontFamily}
              fontSize={conceptTheme.updateFontSize}
              fontWeight={conceptTheme.fontWeight}
              variant="h6"
            >
              {concept.name}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <Typography minWidth={60}>To:</Typography>
            <TextField
              fullWidth
              onChange={handleChange}
              slotProps={{
                input: {
                  sx: {
                    color: toColor,
                    cursor: "text",
                    fontFamily: conceptTheme.fontFamily,
                    fontSize: conceptTheme.updateFontSize,
                    fontWeight: conceptTheme.fontWeight,
                    height: "auto",
                    borderBottom: "none",
                    "&::before": { borderBottom: "none" },
                    "&::after": { borderBottom: "none" },
                  },
                },
              }}
              value={conceptState.name}
              variant="standard"
            />
          </Box>
        </Box>
        <Box sx={{ borderTop: "1px solid #000000" }}>
          <Box sx={{ mt: 2 }}>
            <div>
              {`Updating the name of concept will affect CxTBD link realizations.`}
            </div>
            <div>{`Proceed with caution.`}</div>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default AlertContentConceptNameUpdate
