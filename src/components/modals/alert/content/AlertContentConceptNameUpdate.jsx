import { use } from "react"

import { Box, TextField, Typography } from "@mui/material"
import { useTheme } from "@mui/material/styles"

import ConceptContext from "@/contexts/concept/ConceptContext"

const AlertContentConceptNameUpdate = () => {
  const { concept: conceptTheme, palette } = useTheme()

  const { concept, conceptState, updateConcept } = use(ConceptContext)
  console.log("conceptState", conceptState)

  const handleChange = event => {
    updateConcept({ name: event.target.value })
  }

  return (
    <>
      <Box>
        <Box display="flex" flexDirection="column" sx={{ mt: 2, ml: 3, mb: 4 }}>
          <Box display="flex" alignItems="center">
            <Typography minWidth={60}>From:</Typography>
            <Typography
              fontFamily={conceptTheme.fontFamily}
              fontSize={conceptTheme.fontSize}
              fontWeight={conceptTheme.fontWeight}
              sx={{ color: palette.common.black }}
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
                    color: palette.primary.main,
                    cursor: "text",
                    fontFamily: conceptTheme.fontFamily,
                    fontSize: conceptTheme.fontSize,
                    fontWeight: conceptTheme.fontWeight,
                    height: "auto",
                  },
                },
              }}
              value={conceptState.name}
              variant="standard"
            />
          </Box>
        </Box>
        <Box sx={{ borderTop: "1px dashed #000000" }}>
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
