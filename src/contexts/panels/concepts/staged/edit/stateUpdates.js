import { drop, isJsonEqual } from '@/lib/utils'

// const STATE_INDEXES = ['aliasIndex', 'mediaIndex', 'realizationIndex']

const alignMediaByStateId = (initial, staged) => {
  if (!staged || !initial) return staged
  const initialByStateId = initial.reduce((acc, item) => {
    acc[item.stateId] = item
    return acc
  }, {})
  return staged
    .map(stagedItem => {
      const initialItem = initialByStateId[stagedItem.stateId]
      return initialItem || stagedItem
    })
    .filter(item => initialByStateId[item.stateId])
}

const hasStateChange = (allInitialState, allStagedState) => {
  // Drop fields that are not relevant to state change comparison
  const initialState = drop(allInitialState, ['aliasIndex', 'mediaIndex', 'realizationIndex'])
  const stagedState = drop(allStagedState, ['aliasIndex', 'mediaIndex', 'realizationIndex'])
  // Align media arrays by stateId before comparison so reordering doesn't matter
  const alignedInitial = { ...initialState, media: alignMediaByStateId(initialState.media, stagedState.media) }
  return !isJsonEqual(stagedState, alignedInitial)
}

const stateUpdates = (initialState, stagedState) => {
  if (!hasStateChange(initialState, stagedState)) {
    return {}
  }

  return stateChanges(initialState, stagedState).reduce((edits, [field, initial, staged]) => {
    edits[field] = { initial, staged }
    return edits
  }, {})
}

const stateChanges = (initialState, stagedState) => {
  const alignedInitial = { ...initialState, media: alignMediaByStateId(initialState.media, stagedState.media) }
  return Object.keys(stagedState).reduce((changes, field) => {
    if (!isJsonEqual(stagedState[field], alignedInitial[field])) {
      changes.push([field, alignedInitial[field], stagedState[field]])
    }
    return changes
  }, [])
}

const createUpdatesInfo = (initialState, stagedState) => {
  const forceLoad = false
  const updates = stateUpdates(initialState, stagedState)
  const hasUpdated = field => updates[field] !== undefined
  const initialValue = field => updates[field]?.initial
  const updatedValue = field => updates[field]?.staged
  return { forceLoad, hasUpdated, initialValue, updatedValue }
}

export { createUpdatesInfo, hasStateChange, stateUpdates }
