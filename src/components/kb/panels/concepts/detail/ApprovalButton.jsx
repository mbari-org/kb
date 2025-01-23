import { use } from "react"
import { PiStamp } from "react-icons/pi"
import { IconButton } from "@mui/material"

import ConceptContext from "@/contexts/concept/ConceptContext"

const ApprovalButton = ({ field }) => {
  const { displayPendingField } = use(ConceptContext)

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
        padding: 0,
      }}
      onClick={() => displayPendingField(field)}
    >
      <PiStamp size={24} />
    </IconButton>
  )
}

export default ApprovalButton
