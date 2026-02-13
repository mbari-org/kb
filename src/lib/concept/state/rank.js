import { generalStateUpdates } from '@/contexts/panels/concepts/staged/edit/stateUpdates'
import { capitalize, isJsonEqual } from '@/lib/utils'

import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import { HISTORY_FIELD } from '@/lib/constants/historyField.js'

const initialState = (concept, pendingConcept) => {
  const { rankLevel, rankName } = concept

  const stateRank = {
    action: CONCEPT_STATE.NO_ACTION,
    level: rankLevel || '',
    name: rankName || '',
  }

  return stagedRank(stateRank, pendingConcept)
}

const editRank = ({ stagedState, update }) => {
  return {
    ...stagedState,
    rank: {
      ...stagedState.rank,
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

const resetRank = ({ stagedState, update }) => {
  return {
    ...stagedState,
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

const isModified = (initial, staged) => !isJsonEqual(initial?.rank, staged?.rank)

const stateUpdates = (initial, staged) => generalStateUpdates('rank', initial, staged)

export { editRank, initialState, isModified, pendingChange, pendingRank, rankField, resetRank, stateUpdates }
