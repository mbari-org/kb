import { use, useEffect, useState } from "react"

import { Stack, Typography } from "@mui/material"
import { useTheme } from "@mui/material/styles"

import Autocomplete from "@mui/material/Autocomplete"
import TextField from "@mui/material/TextField"

import ConceptContext from "@/contexts/concept/ConceptContext"
import SelectedContext from "@/contexts/selected/SelectedContext"
import TaxonomyContext from "@/contexts/taxonomy/TaxonomyContext"

const TaxonomySearch = ({ setAutoExpand }) => {
  const theme = useTheme()

  const { concept } = use(ConceptContext)
  const { selectConcept } = use(SelectedContext)
  const { getConcept, taxonomy } = use(TaxonomyContext)

  const [value, setValue] = useState("")

  const handleConceptChange = (_event, selectedName) => {
    if (selectedName) {
      const primaryName = getConcept(selectedName)?.name
      if (primaryName) {
        setAutoExpand({ expand: true, name: primaryName })
      }
      selectConcept(primaryName || selectedName)
    }
  }

  useEffect(() => {
    const primaryName = getConcept(concept?.name)?.name
    setValue(primaryName || "")
  }, [concept, getConcept, taxonomy])

  return (
    <Autocomplete
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
            Search
          </Typography>
          <TextField
            {...params}
            sx={{
              backgroundColor: theme.palette.primary.pale,
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
                backgroundColor: theme.palette.primary.light,
              },
            },
          },
        },
      }}
      value={value}
    />
  )
}

export default TaxonomySearch
