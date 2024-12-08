import { use } from "react"
import { Breadcrumbs, Button } from "@mui/material"
import NavigateNextIcon from "@mui/icons-material/NavigateNext"

import ConceptContext from "@/contexts/concept/ConceptContext"
import SelectedContext from "@/contexts/selected/SelectedContext"

const ConceptPath = () => {
  const { conceptPath } = use(ConceptContext)
  const { selectConcept } = use(SelectedContext)

  return (
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      sx={{
        "& .MuiBreadcrumbs-separator": { mx: 0 },
        "& .MuiButton-root": {
          padding: "0px",
          minWidth: "auto",
          textTransform: "none",
        },
      }}
    >
      {conceptPath.map((path, index) => (
        <Button
          key={index}
          color={index === conceptPath.length - 1 ? "primary" : "inherit"}
          onClick={() => {
            if (index === conceptPath.length - 1) return
            selectConcept(path)
          }}
        >
          {path}
        </Button>
      ))}
    </Breadcrumbs>
  )
}

export default ConceptPath
