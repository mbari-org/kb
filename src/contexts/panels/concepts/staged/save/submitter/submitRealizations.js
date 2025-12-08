import { createRealization, deleteRealization, updateRealization } from '@/lib/kb/api/realizations'

import { CONCEPT_STATE } from '@/constants/conceptState.js'

const { REALIZATION: REALIZATION } = CONCEPT_STATE

import { createError } from '@/lib/errors'
import { diff, drop, pick } from '@/lib/utils'
const submitRealizations = ([submit, { concept, updatesInfo }]) => {
  const { hasUpdated, initialValue, updatedValue } = updatesInfo

  if (!hasUpdated('realizations')) {
    return []
  }

  const initialRealizations = initialValue('realizations')

  const submitRealization = (apiFn, trackerInfo) =>
    submit(apiFn, trackerInfo.params)
      .then(response => ({
        field: 'realizations',
        response,
        ...trackerInfo,
      }))
      .catch(error => ({
        field: 'realizations',
        error: createError(
          'Realization Operation Failed',
          `Failed to ${getRealizationActionMessage(trackerInfo.action)} realization for concept ${concept.name}`,
          {
            conceptName: concept.name,
            realizationId: trackerInfo.update.id,
            linkName: trackerInfo.update.linkName,
            toConcept: trackerInfo.update.toConcept,
            action: trackerInfo.action,
            index: trackerInfo.index,
          },
          error
        ),
        ...trackerInfo,
      }))

  const getRealizationActionMessage = action => {
    switch (action) {
      case REALIZATION.ADD:
        return 'add'
      case REALIZATION.EDIT:
        return 'update'
      case REALIZATION.DELETE:
        return 'delete'
      default:
        return 'process'
    }
  }

  const realizationAdd = update => {
    const realization = pick(update, ['linkName', 'toConcept', 'linkValue'])
    const params = {
      ...realization,
      concept: concept.name,
    }
    return { apiFn: createRealization, params, action: REALIZATION.ADD }
  }

  const realizationEdit = (update, index) => {
    const prior = initialRealizations[index]
    const updateDiff = diff(update, prior)
    const realization = drop(updateDiff, ['action'])
    const params = [prior.id, realization]
    return { apiFn: updateRealization, params, action: REALIZATION.EDIT }
  }

  const realizationDelete = update => {
    const params = update.id
    return { apiFn: deleteRealization, params, action: REALIZATION.DELETE }
  }

  const actionSubmitter = {
    [REALIZATION.ADD]: realizationAdd,
    [REALIZATION.EDIT]: (u, i) => realizationEdit(u, i),
    [REALIZATION.DELETE]: realizationDelete,
  }

  const submitters = updatedValue('realizations').reduce((acc, update, index) => {
    const submitter = actionSubmitter[update.action]
    if (!submitter) return acc
    const { apiFn, params, action } = submitter(update, index)
    const trackerInfo = { action, index, params, update }
    acc.push(submitRealization(apiFn, trackerInfo))
    return acc
  }, [])

  return submitters
}

export default submitRealizations
