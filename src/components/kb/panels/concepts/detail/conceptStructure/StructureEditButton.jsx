import { use } from "react"
import { CiEdit } from "react-icons/ci"
import { IconButton } from "@mui/material"

import ConceptContext from "@/contexts/concept/ConceptContext"

const StructureEditButton = ({ onClick }) => {
  const { editing } = use(ConceptContext)

  return (
    <IconButton
      aria-label="Edit concept name"
      color="main"
      disabled={editing}
      onClick={onClick}
      sx={{
        mb: 2,
        ml: 0.5,
        padding: 0,
        visibility: editing ? "hidden" : "visible",
        "&:hover": {
          backgroundColor: `transparent !important`,
          transform: "scale(1.25)",
        },
      }}
    >
      <CiEdit size={24} />
    </IconButton>
  )
}

export default StructureEditButton
