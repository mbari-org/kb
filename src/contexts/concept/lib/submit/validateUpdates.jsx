import RankUpdateErrorActions from "@/components/kb/panels/concepts/detail/rankUpdateError/RankUpdateErrorActions"
import RankUpdateErrorContent from "@/components/kb/panels/concepts/detail/rankUpdateError/RankUpdateErrorContent"
import RankUpdateErrorTitle from "@/components/kb/panels/concepts/detail/rankUpdateError/RankUpdateErrorTitle"
import { createModal } from "@/components/modal/factory"

import { isAdmin } from "@/lib/auth/role"

import { pickFields } from "@/lib/util"

import { CONCEPT } from "@/contexts/concept/lib/conceptStateReducer"

const validateRankUpdates = async ({
  concept,
  initialState,
  modifyConcept,
  setModal,
  updates,
  user,
}) => {
  let validation = {
    rankLevel: true,
    rankName: true,
  }

  if (isAdmin(user)) {
    return validation
  }

  const removeLevel = updates.rankLevel === ""
  const removeName = updates.rankName === ""

  if (!(removeLevel || removeName)) {
    return validation
  }

  let resolvePromise
  const promise = new Promise(resolve => {
    resolvePromise = resolve
  })

  const onAction = () => {
    // Restore removed rank level and/or name
    if (removeLevel) {
      modifyConcept({
        type: CONCEPT.SET_FIELD,
        update: { rankLevel: concept.rankLevel },
      })
      validation = { ...validation, rankLevel: false }
    }
    if (removeName) {
      modifyConcept({
        type: CONCEPT.SET_FIELD,
        update: { rankName: concept.rankName },
      })
      validation = { ...validation, rankName: false }
    }
    setModal(null)
    resolvePromise(validation)
  }

  const rankUpdates = pickFields(updates, ["rankName", "rankLevel"])

  const detailUpdates = {}
  Object.keys(rankUpdates).forEach(field => {
    if (updates[field] !== initialState[field]) {
      detailUpdates[field] = {
        initial: initialState[field],
        pending: updates[field],
      }
    }
  })

  const fieldDisplay = field => (field !== "" ? field : '""')
  const pendingEditDisplay = field => {
    const { initial, pending } = detailUpdates[field]
    return `${fieldDisplay(initial)} --> ${fieldDisplay(pending)}`
  }
  const detailUpdatesDisplay = Object.keys(detailUpdates).reduce(
    (acc, field) => {
      acc[field] = pendingEditDisplay(field)
      return acc
    },
    {}
  )

  const modal = createModal({
    Actions: () => <RankUpdateErrorActions onAction={onAction} />,
    Content: () => <RankUpdateErrorContent detail={detailUpdatesDisplay} />,
    Title: RankUpdateErrorTitle,
  })
  setModal(modal)

  return promise
}

const validateUpdates = async updatesObject => {
  let rankValidation = await validateRankUpdates(updatesObject)

  return {
    author: true,
    ...rankValidation,
  }
}

export default validateUpdates
