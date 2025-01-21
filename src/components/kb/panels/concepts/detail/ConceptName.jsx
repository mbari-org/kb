import { use } from "react"
import { CiEdit } from "react-icons/ci"

import { IconButton, Stack, Typography } from "@mui/material"
import { useTheme } from "@mui/material/styles"

import ConceptPendingApprovalButton from "./ConceptPendingApprovalButton"

import {
  createAlertButtonsConceptNameUpdate,
  createAlertContentConceptNameUpdate,
  createAlertTitle,
} from "@/components/modals/alert/components"

import AuthContext from "@/contexts/auth/AuthContext"
import ConceptContext from "@/contexts/concept/ConceptContext"
import ModalContext from "@/contexts/modal/ModalContext"

import { isAdmin, isReadOnly } from "@/lib/auth/role"
import { hasPendingHistory } from "@/lib/kb/util"

const ConceptName = () => {
  const { concept: conceptTheme } = useTheme()

  const { user } = use(AuthContext)
  const { concept, editing, pendingHistory } = use(ConceptContext)
  const { setModalAlert } = use(ModalContext)

  const nameHasPendingHistory = hasPendingHistory(pendingHistory, "ConceptName")

  const showApprovalButton = editing && nameHasPendingHistory && isAdmin(user)
  const showEditButton = !editing && !nameHasPendingHistory && !isReadOnly(user)

  const conceptColor = nameHasPendingHistory
    ? conceptTheme.color.pending
    : conceptTheme.color.clean

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
        {concept?.name}
      </Typography>
      {showEditButton && (
        <IconButton
          aria-label="Edit concept name"
          color="main"
          disabled={editing}
          onClick={editConceptName}
          sx={{
            mb: 3,
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
      )}
      {showApprovalButton && (
        <ConceptPendingApprovalButton field={"conceptName"} />
      )}
    </Stack>
  )
}

export default ConceptName
