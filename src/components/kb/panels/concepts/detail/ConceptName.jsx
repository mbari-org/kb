import { use, useState } from "react"

import { Stack, Typography } from "@mui/material"
import { useTheme } from "@mui/material/styles"

import ApprovalButton from "@/components/kb/panels/concepts/detail/ApprovalButton"
import ChangeStructureButton from "./structure/ConceptStructureButton"
import ChangeStructureChoices from "./structure/ConceptStructureChoices"

import AuthContext from "@/contexts/auth/AuthContext"
import ConceptContext from "@/contexts/concept/ConceptContext"

import { hasPendingHistory } from "@/lib/kb/util/pendingHistory"
import { isAdmin, isReadOnly } from "@/lib/auth/role"

const ConceptName = () => {
  const { concept: conceptTheme } = useTheme()

  const [showStructureChoices, setShowStructureChoices] = useState(false)

  const { user } = use(AuthContext)
  const { concept, editing, editingState, pendingHistory } = use(ConceptContext)

  const nameHasPendingHistory = hasPendingHistory(pendingHistory, "ConceptName")
  const conceptHasNameUpdate = editingState.name !== concept.name

  const showApprovalButton =
    isAdmin(user) && editing && nameHasPendingHistory && !showStructureChoices
  const showStructureButton =
    !isReadOnly(user) && editing && !showStructureChoices

  const conceptColor =
    nameHasPendingHistory || conceptHasNameUpdate
      ? conceptTheme.color.pending
      : conceptTheme.color.clean

  return (
    <Stack direction="row" alignItems="center" sx={{ position: "relative" }}>
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
      {showApprovalButton && <ApprovalButton field={"conceptName"} />}
      {showStructureButton && (
        <ChangeStructureButton onClick={() => setShowStructureChoices(true)} />
      )}
      {showStructureChoices && (
        <ChangeStructureChoices
          onClose={() => setShowStructureChoices(false)}
        />
      )}
    </Stack>
  )
}

export default ConceptName
