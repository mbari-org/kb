import { use } from "react"

import { Button } from "@mui/material"
import { IoClose } from "react-icons/io5"

import ConceptContext from "@/contexts/concept/ConceptContext"

import { CONCEPT } from "@/contexts/concept/lib/conceptStateReducer"

const ResetField = ({ field }) => {
  const { modifyConcept } = use(ConceptContext)

  const handleButtonClick = () => {
    modifyConcept({ type: CONCEPT.RESET_FIELD, field })
  }

  return (
    <Button
      color="cancel"
      onClick={handleButtonClick}
      sx={{
        mr: 0.5,
        minWidth: "auto",
        pl: 0.5,
      }}
    >
      <IoClose />
    </Button>
  )
}

export default ResetField
