import { use } from "react"
import { CiEdit } from "react-icons/ci"

import { IconButton, Stack, Typography } from "@mui/material"
import { useTheme } from "@mui/material/styles"

import {
  createAlertButtonsConceptNameUpdate,
  createAlertContentConceptNameUpdate,
  createAlertTitle,
} from "@/components/modals/alert/components"

import ConceptContext from "@/contexts/concept/ConceptContext"
import ModalContext from "@/contexts/modal/ModalContext"
import TaxonomyContext from "@/contexts/taxonomy/TaxonomyContext"

import { isEmpty } from "@/lib/util"

const ConceptName = () => {
  const { concept: conceptTheme } = useTheme()

  const { concept, editing } = use(ConceptContext)
  const { setModalAlert } = use(ModalContext)
  const { getConceptPendingHistory } = use(TaxonomyContext)

  const hasPendingHistory = !isEmpty(
    getConceptPendingHistory(concept.name, "ConceptName")
  )

  const conceptColor = hasPendingHistory
    ? conceptTheme.color.pending
    : conceptTheme.color.detail

  const editConceptName = () => {
    setModalAlert({
      Title: createAlertTitle({
        title: "Update Concept Name",
      }),
      Content: createAlertContentConceptNameUpdate(),
      Choices: createAlertButtonsConceptNameUpdate(),
    })
  }

  return (
    <Stack direction="row" alignItems="center">
      <Typography
        component="div"
        sx={{
          fontFamily: conceptTheme.fontFamily,
          fontSize: conceptTheme.infoFontSize,
          fontWeight: conceptTheme.fontWeight,
          backgroundColor: "transparent",
          color: conceptColor,
        }}
        variant="body1"
      >
        {concept.name}
      </Typography>
      {!editing && !hasPendingHistory && (
        <IconButton
          aria-label="Edit concept name"
          color="main"
          disabled={editing}
          onClick={editConceptName}
          sx={{
            mb: 2,
            visibility: editing ? "hidden" : "visible",
          }}
        >
          <CiEdit size={24} />
        </IconButton>
      )}
    </Stack>
  )
}

export default ConceptName
