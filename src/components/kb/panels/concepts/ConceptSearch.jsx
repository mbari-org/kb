import { use, useEffect, useState } from "react"

import { Stack, Typography } from "@mui/material"
import { alpha, useTheme } from "@mui/material/styles"

import Autocomplete from "@mui/material/Autocomplete"
import TextField from "@mui/material/TextField"

import SelectedContext from "@/contexts/selected/SelectedContext"
import TaxonomyContext from "@/contexts/taxonomy/TaxonomyContext"

const ConceptSearch = ({ concept, setAutoExpand }) => {
  const theme = useTheme()
  const { updateSelectedConcept: selectConcept } = use(SelectedContext)
  const { taxonomy } = use(TaxonomyContext)

  const [conceptName, setConceptName] = useState(null)

  const handleConceptChange = (_event, conceptName) => {
    if (conceptName) {
      selectConcept(conceptName)
      setAutoExpand({ expand: true, name: conceptName })
    }
  }

  useEffect(() => {
    setConceptName(concept.name)
  }, [concept])

  return (
    <Autocomplete
      // disablePortal
      onChange={handleConceptChange}
      options={taxonomy.names}
      renderInput={params => (
        <Stack>
          <Typography
            sx={{
              fontSize: theme => theme.typography.fontSize * 1.4,
              fontWeight: "bold",
            }}
          >
            Concept
          </Typography>
          <TextField
            {...params}
            sx={{
              backgroundColor: alpha(theme.palette.primary.main, 0.2),
            }}
          />
          <hr />
        </Stack>
      )}
      size="small"
      slotProps={{
        paper: {
          sx: {
            "& .MuiAutocomplete-listbox": {
              "& .MuiAutocomplete-option": {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
              },
            },
          },
        },
      }}
      value={conceptName}
    />
  )
}

export default ConceptSearch
