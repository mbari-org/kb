import { use } from "react"
import { PiStamp } from "react-icons/pi"
import { IconButton } from "@mui/material"

import ConceptContext from "@/contexts/concept/ConceptContext"

const ConceptPendingApprovalButton = ({ field }) => {
  const { displayPendingEdit } = use(ConceptContext)

  return (
    <IconButton
      color="main"
      sx={{
        backgroundColor: "main",
        "&:hover": {
          backgroundColor: `transparent !important`,
          transform: "scale(1.25)",
        },
        mb: 2,
        marginLeft: "-8px",
        padding: 0,
      }}
      onClick={() => displayPendingEdit(field)}
    >
      <PiStamp size={24} />
    </IconButton>
  )
}

export default ConceptPendingApprovalButton
