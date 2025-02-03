import { use } from "react"

import { Stack, Typography } from "@mui/material"
import { useTheme } from "@mui/material/styles"

import ApprovalButton from "@/components/kb/panels/concepts/detail/ApprovalButton"
import AuthContext from "@/contexts/auth/AuthContext"
import ConceptContext from "@/contexts/concept/ConceptContext"
import { isAdmin, isReadOnly } from "@/lib/auth/role"
import { hasPendingHistory } from "@/lib/kb/util"
import ConceptNameEditButton from "./conceptName/ConceptNameEditButton"

const ConceptName = () => {
  const { concept: conceptTheme } = useTheme()

  const { user } = use(AuthContext)
  const { concept, editing, pendingHistory } = use(ConceptContext)

  const nameHasPendingHistory = hasPendingHistory(pendingHistory, "ConceptName")

  const showApprovalButton = editing && nameHasPendingHistory && isAdmin(user)
  const showEditButton = !editing && !nameHasPendingHistory && !isReadOnly(user)

  const conceptColor = nameHasPendingHistory
    ? conceptTheme.color.pending
    : conceptTheme.color.clean

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
      {showEditButton && <ConceptNameEditButton />}
      {showApprovalButton && <ApprovalButton field={"conceptName"} />}
    </Stack>
  )
}

export default ConceptName
