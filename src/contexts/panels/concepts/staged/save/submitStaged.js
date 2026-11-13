import { stateUpdatesInfo } from '@/contexts/panels/concepts/staged/edit/stateUpdates'

import buildAliasSubmit from '@/contexts/panels/concepts/staged/save/submitter/submitAliases'
import buildAuthorSubmit from '@/contexts/panels/concepts/staged/save/submitter/submitAuthor'
import buildChildSubmit from '@/contexts/panels/concepts/staged/save/submitter/submitChildren'
import buildMediaSubmit from '@/contexts/panels/concepts/staged/save/submitter/submitMedia'
import buildNameSubmit from '@/contexts/panels/concepts/staged/save/submitter/submitName'
import buildParentSubmit from '@/contexts/panels/concepts/staged/save/submitter/submitParent'
import buildRankSubmit from '@/contexts/panels/concepts/staged/save/submitter/submitRank'
import buildRealizationSubmit from '@/contexts/panels/concepts/staged/save/submitter/submitRealizations'

import { createEffectiveState } from '@/lib/concept/state/effectiveState'
import { buildStagedJournal } from '@/lib/concept/state/stagedJournal'
import { CONCEPT } from '@/lib/constants'
import { createError } from '@/lib/errors'

const builders = {
  [CONCEPT.FIELD.ALIASES]: buildAliasSubmit,
  [CONCEPT.FIELD.AUTHOR]: buildAuthorSubmit,
  [CONCEPT.FIELD.CHILDREN]: buildChildSubmit,
  [CONCEPT.FIELD.MEDIA]: buildMediaSubmit,
  [CONCEPT.FIELD.NAME]: buildNameSubmit,
  [CONCEPT.FIELD.PARENT]: buildParentSubmit,
  [CONCEPT.FIELD.RANK]: buildRankSubmit,
  [CONCEPT.FIELD.REALIZATIONS]: buildRealizationSubmit,
}

const wrapSubmitError = (op, effectiveName, error) => {
  switch (op.field) {
    case CONCEPT.FIELD.CHILDREN:
      return createError(
        'Child Creation Failed',
        `Failed to add child concept ${op.item.name} to ${effectiveName}`,
        {
          action: op.action,
          childName: op.item.name,
          index: op.index,
          parentName: effectiveName,
        },
        error
      )
    case CONCEPT.FIELD.MEDIA:
      return createError(
        'Media Operation Failed',
        `Failed to ${op.action} item for concept ${effectiveName}`,
        {
          action: op.action,
          conceptName: effectiveName,
          index: op.index,
          mediaId: op.item.id,
          mediaType: op.item.mediaType,
        },
        error
      )
    case CONCEPT.FIELD.REALIZATIONS:
      return createError(
        'Realization Operation Failed',
        `Failed to process realization for concept ${effectiveName}`,
        {
          action: op.action,
          conceptName: effectiveName,
          index: op.index,
          linkName: op.item.linkName,
          realizationId: op.item.id,
          toConcept: op.item.toConcept,
        },
        error
      )
    default:
      return error
  }
}

const submitStaged = async (initialState, stagedState, updatesContext) => {
  const { apiFns, isAdmin, staleConcept } = updatesContext
  const submit = apiFns.apiPayload

  const info = stateUpdatesInfo(initialState, stagedState)
  const ops = buildStagedJournal(initialState, stagedState)
  const effective = createEffectiveState(initialState, { applyImmediately: isAdmin })

  const results = []
  let failedOp = null

  for (let i = 0; i < ops.length; i += 1) {
    const op = ops[i]
    const builder = builders[op.field]
    const { apiFn, params, tracker } = builder(op, effective)
    const conceptName = effective.state.name

    try {
      const response = await submit(apiFn, params)
      results.push({ ...tracker, params, response })
      effective.apply(op)
    } catch (error) {
      const wrapped = wrapSubmitError(op, conceptName, error)
      results.push({ ...tracker, params, error: wrapped })
      failedOp = { index: i, op }
      break
    }
  }

  info.results = results

  if (failedOp) {
    const skippedOperations = ops.slice(failedOp.index + 1).map(op => ({
      action: op.action,
      field: op.field,
      index: op.index,
      seq: op.seq,
    }))
    const failedResults = results.filter(result => result.error)
    const failedOperations = failedResults.map(result => ({
      action: result.action,
      details: result.error.details,
      field: result.field,
      message: result.error.message,
    }))
    const failuresByField = failedOperations.reduce((acc, operation) => {
      acc[operation.field] = acc[operation.field] || []
      acc[operation.field].push(operation)
      return acc
    }, {})
    const fieldsWithErrors = Object.keys(failuresByField).join(', ')

    throw createError(
      'Concept Save Error',
      `Failed to save changes to concept ${staleConcept.name} in fields: ${fieldsWithErrors}`,
      {
        completedOperations: results
          .filter(result => !result.error)
          .map(result => ({
            action: result.action,
            field: result.field,
          })),
        conceptName: staleConcept.name,
        failedOperations,
        failuresByField,
        skippedOperations,
      },
      failedResults[0].error
    )
  }

  return info
}

export default submitStaged
