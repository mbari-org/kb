import { use } from "react"
import { CiEdit } from "react-icons/ci"

import { Button, Stack, Typography } from "@mui/material"
import { useTheme } from "@mui/material/styles"

import {
  // createAlertButtons,
  createAlertButtonsConceptNameUpdate,
  createAlertContentConceptNameUpdate,
  createAlertTitle,
} from "@/components/modals/alert/components"

import ConceptContext from "@/contexts/concept/ConceptContext"
import ModalContext from "@/contexts/modal/ModalContext"
import TaxonomyContext from "@/contexts/taxonomy/TaxonomyContext"

const ConceptName = () => {
  const { concept: conceptTheme } = useTheme()

  const { concept, editing } = use(ConceptContext)
  const { setModalAlert } = use(ModalContext)
  const { getPendingHistory } = use(TaxonomyContext)

  const hasPendingHistory = !!getPendingHistory(concept.name)

  const conceptColor = hasPendingHistory
    ? conceptTheme.pendingHistoryColor
    : conceptTheme.color

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
          fontSize: conceptTheme.fontSize,
          fontWeight: conceptTheme.fontWeight,
          backgroundColor: "transparent",
          color: conceptColor,
        }}
        variant="body1"
      >
        {concept.name}
      </Typography>
      {!editing && (
        <Button
          startIcon={<CiEdit size={24} />}
          sx={{
            mb: 2,
            ml: 1.5,
            minWidth: "auto",
            padding: "0",
          }}
          onClick={editConceptName}
        />
      )}
    </Stack>
  )
}

export default ConceptName
