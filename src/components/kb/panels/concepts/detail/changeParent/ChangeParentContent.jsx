import { use } from "react"

import {
  Box,
  Stack,
  Typography,
  Autocomplete,
  TextField,
  Divider,
} from "@mui/material"
import { useTheme } from "@mui/material/styles"

import ConceptContext from "@/contexts/concept/ConceptContext"
import TaxonomyContext from "@/contexts/taxonomy/TaxonomyContext"

const ChangeParentContent = () => {
  const theme = useTheme()

  const { concept, editingState, modifyConcept } = use(ConceptContext)
  const { getConceptNames } = use(TaxonomyContext)

  const conceptNames = getConceptNames().filter(
    name => name !== concept.name && name !== concept.parent.name
  )

  const fromColor = theme.concept.color.clean
  // const toColor = theme.concept.color.pending

  const handleChange = event => {
    // modifyConcept({ type: "SET_PARENT", update: { name: event.target.value } })
  }

  return (
    <Box>
      <Typography variant="h6">Change Parent</Typography>
      <Stack spacing={2} sx={{ mt: 2, ml: 3, mb: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography minWidth={60}>From:</Typography>
          <Typography
            color={fromColor}
            fontFamily={theme.concept.fontFamily}
            fontSize={theme.concept.updateFontSize}
            fontWeight={theme.concept.fontWeight}
            // variant="h6"
          >
            {concept.parent.name}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography minWidth={60}>To:</Typography>
          <Autocomplete
            onChange={handleChange}
            options={conceptNames}
            renderInput={params => (
              <TextField
                {...params}
                fullWidth
                sx={{
                  border: "none",
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                  "&:before": {
                    border: "none",
                    content: '""',
                  },
                  "&:after": {
                    borderBottom: `2px solid ${theme.palette.primary.main}`,
                    content: '""',
                  },
                  fontSize: theme.concept.updateFontSize,
                  fontFamily: theme.concept.fontFamily,
                  fontWeight: theme.concept.fontWeight,
                  "& input": {
                    fontSize: theme.concept.updateFontSize,
                    fontFamily: theme.concept.fontFamily,
                    fontWeight: theme.concept.fontWeight,
                  },
                  ml: -2,
                }}
              />
            )}
            size="small"
            // value={}
            sx={{ width: "500px" }}
          />
          <Divider sx={{ marginTop: 1 }} />
        </Stack>
      </Stack>
    </Box>
  )
}

export default ChangeParentContent
