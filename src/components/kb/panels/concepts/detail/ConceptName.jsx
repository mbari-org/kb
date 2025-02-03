import { use, useState } from "react"

import { Stack, Typography } from "@mui/material"
import { useTheme } from "@mui/material/styles"

import ApprovalButton from "@/components/kb/panels/concepts/detail/ApprovalButton"
import ConceptStructureButton from "./conceptStructure/ConceptStructureButton"
import ConceptStructureChoices from "./conceptStructure/ConceptStructureChoices"

import AuthContext from "@/contexts/auth/AuthContext"
import ConceptContext from "@/contexts/concept/ConceptContext"

import { hasPendingHistory } from "@/lib/kb/util"
import { isAdmin, isReadOnly } from "@/lib/auth/role"

const ConceptName = () => {
  const { concept: conceptTheme } = useTheme()

  const [showEditChoices, setShowEditChoices] = useState(false)

  const { user } = use(AuthContext)
  const { concept, editing, pendingHistory } = use(ConceptContext)

  const nameHasPendingHistory = hasPendingHistory(pendingHistory, "ConceptName")

  const showApprovalButton =
    editing && nameHasPendingHistory && isAdmin(user) && !showEditChoices
  const showEditStructureButton =
    !editing && !nameHasPendingHistory && !isReadOnly(user) && !showEditChoices

  const conceptColor = nameHasPendingHistory
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
      {showEditStructureButton && (
        <ConceptStructureButton onClick={() => setShowEditChoices(true)} />
      )}
      {showEditChoices && (
        <ConceptStructureChoices onClose={() => setShowEditChoices(false)} />
      )}
    </Stack>
  )
}

export default ConceptName
