import { use } from "react"
import { PiStamp } from "react-icons/pi"
import { IconButton } from "@mui/material"

import ConceptContext from "@/contexts/concept/ConceptContext"

const ConceptPendingApprovalButton = ({ field }) => {
  const { displayPendingEditAlert } = use(ConceptContext)

  return (
    <IconButton
      color="main"
      sx={{
        backgroundColor: "main",
        "&:hover": {
          backgroundColor: `transparent !important`,
          transform: "scale(1.25)",
        },
        padding: 0.5,
      }}
      onClick={() => displayPendingEditAlert(field)}
    >
      <PiStamp />
    </IconButton>
  )
}

export default ConceptPendingApprovalButton
