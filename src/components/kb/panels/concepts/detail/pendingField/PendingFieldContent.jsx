import { use } from "react"

import DescriptionDetail from "../DescriptionDetail"

import ConceptContext from "@/contexts/concept/ConceptContext"

import { getFieldPendingHistory, pickFields } from "@/lib/kb/util"

const PendingFieldContent = ({ field }) => {
  const { pendingHistory } = use(ConceptContext)
  const pendingFieldHistory = getFieldPendingHistory(pendingHistory, field)

  const displayValues = pickFields(pendingFieldHistory, [
    "action",
    ["oldValue", "before"],
    ["newValue", "after"],
    ["creatorName", "user"],
    ["creationTimestamp", "created"],
  ])

  return <DescriptionDetail description={field} detail={displayValues} />
}

export default PendingFieldContent
