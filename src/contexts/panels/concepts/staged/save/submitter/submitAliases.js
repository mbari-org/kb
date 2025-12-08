import { createAlias, deleteAlias, updateAlias } from '@/lib/api/aliases'

import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

const { ALIAS: ALIAS } = CONCEPT_STATE

import { diff, drop, pick } from '@/lib/utils'

const submitAliases = ([submit, { concept, updatesInfo }]) => {
  const { hasUpdated, initialValue, updatedValue } = updatesInfo

  if (!hasUpdated('aliases')) {
    return []
  }

  const initialAliases = initialValue('aliases')

  const submitAlias = (apiFn, trackerInfo) =>
    submit(apiFn, trackerInfo.params).then(response => ({
      field: 'aliases',
      response,
      ...trackerInfo,
    }))

  const aliasAdd = update => {
    const aliasUpdate = pick(update, ['author', 'nameType'])
    const params = {
      ...aliasUpdate,
      name: concept.name,
      newName: update.name,
    }
    return { apiFn: createAlias, params, action: ALIAS.ADD }
  }

  const aliasEdit = (update, index) => {
    const prior = initialAliases[index]
    const updateDiff = diff(update, prior)
    const aliasUpdate = drop(updateDiff, ['action'])
    if (aliasUpdate.name) {
      aliasUpdate.newName = update.name
      delete aliasUpdate.name
    }
    const params = [prior.name, aliasUpdate]
    return { apiFn: updateAlias, params, action: ALIAS.EDIT }
  }

  const aliasDelete = update => {
    const params = update.name
    return { apiFn: deleteAlias, params, action: ALIAS.DELETE }
  }

  const actionSubmitter = {
    [ALIAS.ADD]: aliasAdd,
    [ALIAS.EDIT]: (u, i) => aliasEdit(u, i),
    [ALIAS.DELETE]: aliasDelete,
  }

  const submitters = updatedValue('aliases').reduce((acc, update, index) => {
    const submitter = actionSubmitter[update.action]
    if (!submitter) return acc
    const { apiFn, params, action } = submitter(update, index)
    const trackerInfo = { action, index, params, update }
    acc.push(submitAlias(apiFn, trackerInfo))
    return acc
  }, [])

  return submitters
}

export default submitAliases
