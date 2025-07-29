import { fieldPending } from '@/lib/kb/model/history'

import { CONCEPT_STATE } from '@/lib/constants'

import { capitalize } from '@/lib/utils'

const rankField = field => `rank${capitalize(field)}`

const rankState = (concept, pending) => {
  const { rankLevel, rankName } = concept

  const conceptRank = {
    action: CONCEPT_STATE.NO_ACTION,
    level: rankLevel || '',
    name: rankName || '',
  }

  return stagedRank(conceptRank, pending)
}

const editRank = (state, update) => {
  const { field, value } = update

  return {
    ...state,
    rank: {
      ...state.rank,
      [field]: value,
    },
  }
}

const pendingValues = (pendingRank, type) => {
  const values = pendingRank[type].split(' ')
  return values.length === 1 ? [null, values[0]] : values
}

const pendingChange = pendingConcept => {
  const pendingRank = fieldPending(pendingConcept, 'Rank').pop()
  if (!pendingRank) return null

  const [newLevel, newName] = pendingValues(pendingRank, 'newValue')
  const [oldLevel, oldName] = pendingValues(pendingRank, 'oldValue')

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
  const pending = pendingChange(pendingConcept)
  if (!pending) return null

  return {
    historyId: pendingConcept.pop().id,
    level: pending.new.level,
    name: pending.new.name,
  }
}

const resetRank = (state, update) => {
  return {
    ...state,
    rank: update.rank,
  }
}

const stagedRank = (conceptRank, pendingConcept) => {
  const pending = pendingRank(pendingConcept)

  if (!pending)
    return {
      rank: conceptRank,
    }

  return {
    rank: {
      action: 'Pending Edit',
      historyId: pending.historyId,
      level: pending.level || conceptRank.level,
      name: pending.name || conceptRank.name,
    },
  }
}

export { editRank, pendingChange, pendingRank, rankField, rankState, resetRank, stagedRank }
