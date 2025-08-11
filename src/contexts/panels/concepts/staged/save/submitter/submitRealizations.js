import { createRealization, deleteRealization, updateRealization } from '@/lib/api/linkRealizations'

import { CONCEPT_STATE } from '@/lib/constants'

const { REALIZATION: REALIZATION } = CONCEPT_STATE

import { diff, drop, pick } from '@/lib/utils'
const submitRealizations = ([submit, { concept, updatesInfo }]) => {
  const { hasUpdated, initialValue, updatedValue } = updatesInfo

  if (!hasUpdated('realizations')) {
    return []
  }

  const initialRealizations = initialValue('realizations')

  const submitRealization = (apiFn, trackerInfo) =>
    submit(apiFn, trackerInfo.params).then(response => ({
      field: 'realizations',
      response,
      ...trackerInfo,
    }))

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
