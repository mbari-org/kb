import { capitalize } from '@/lib/utils'

import { HISTORY_FIELD } from '@/constants/historyField.js'
import { CONCEPT_STATE } from '@/constants/conceptState.js'

const rankState = (concept, pendingConcept) => {
  const { rankLevel, rankName } = concept

  const stateRank = {
    action: CONCEPT_STATE.NO_ACTION,
    level: rankLevel || '',
    name: rankName || '',
  }

  return stagedRank(stateRank, pendingConcept)
}

const editRank = (state, update) => {
  return {
    ...state,
    rank: {
      ...state.rank,
      ...update,
    },
  }
}

const isPendingRank = pendingConcept => pendingConcept.field === HISTORY_FIELD.RANK

const pendingValues = (pendingRank, type) => {
  const values = pendingRank[type].split(' ')
  return values.length === 1 ? [null, values[0]] : values
}

const pendingChange = pendingConcept => {
  const rank = pendingConcept.find(isPendingRank)
  if (!rank) return null

  const [newLevel, newName] = pendingValues(rank, 'newValue')
  const [oldLevel, oldName] = pendingValues(rank, 'oldValue')

  return {
    new: {
      level: newLevel || '',
      name: newName || '',
    },
    old: {
      level: oldLevel || '',
      name: oldName || '',
    },
  }
}

const pendingRank = pendingConcept => {
  const rankChange = pendingChange(pendingConcept)
  if (!rankChange) return null

  const rank = pendingConcept.find(isPendingRank)

  return {
    creatorName: rank.creatorName,
    creationTimestamp: rank.creationTimestamp,
    historyId: rank.id,
    level: rankChange.new.level,
    name: rankChange.new.name,
  }
}

const rankField = field => `rank${capitalize(field)}`

const resetRank = (state, update) => {
  return {
    ...state,
    rank: update.rank,
  }
}

const stagedRank = (stateRank, pendingConcept) => {
  const pending = pendingRank(pendingConcept)

  if (!pending)
    return {
      rank: stateRank,
    }

  return {
    rank: {
      action: 'Edit Pending',
      historyId: pending.historyId,
      // Use nullish coalescing semantics so empty strings are respected (admins may set '')
      level: pending.level ?? stateRank.level,
      name: pending.name ?? stateRank.name,
    },
  }
}

export { editRank, pendingChange, pendingRank, rankField, rankState, resetRank }
