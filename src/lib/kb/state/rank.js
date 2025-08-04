import { fieldPending } from '@/lib/kb/model/history'

import { CONCEPT_STATE } from '@/lib/constants'

import { capitalize } from '@/lib/utils'

const rankField = field => `rank${capitalize(field)}`

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

const pendingValues = (pendingRank, type) => {
  const values = pendingRank[type].split(' ')
  return values.length === 1 ? [null, values[0]] : values
}

const pendingChange = pendingConcept => {
  const rank = fieldPending(pendingConcept, 'Rank')[0]
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

  const rank = fieldPending(pendingConcept, 'Rank')[0]

  return {
    creatorName: rank.creatorName,
    creationTimestamp: rank.creationTimestamp,
    historyId: rank.id,
    level: rankChange.new.level,
    name: rankChange.new.name,
  }
}

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
      level: pending.level || stateRank.level,
      name: pending.name || stateRank.name,
    },
  }
}

export { editRank, pendingChange, pendingRank, rankField, rankState, resetRank }
