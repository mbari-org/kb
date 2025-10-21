import submitAliases from '@/contexts/panels/concepts/staged/save/submitter/submitAliases'
import submitAuthor from '@/contexts/panels/concepts/staged/save/submitter/submitAuthor'
import submitChildren from '@/contexts/panels/concepts/staged/save/submitter/submitChildren'
import submitMedia from '@/contexts/panels/concepts/staged/save/submitter/submitMedia'
import submitName from '@/contexts/panels/concepts/staged/save/submitter/submitName'
import submitParent from '@/contexts/panels/concepts/staged/save/submitter/submitParent'
import submitRank from '@/contexts/panels/concepts/staged/save/submitter/submitRank'
import submitRealizations from '@/contexts/panels/concepts/staged/save/submitter/submitRealizations'

import { createUpdatesInfo } from '@/contexts/panels/concepts/staged/edit/stateUpdates'
import { createError } from '@/lib/errors'

const submitStaged = async (apiPayload, concept, initialState, stagedState) => {
  const updatesInfo = createUpdatesInfo(initialState, stagedState)

  const submitterInfo = [apiPayload, { concept, updatesInfo }]

  const submitters = []
  submitters.push(...submitAliases(submitterInfo))
  submitters.push(...submitAuthor(submitterInfo))
  submitters.push(...submitChildren(submitterInfo))
  submitters.push(...submitMedia(submitterInfo))
  submitters.push(...submitName(submitterInfo))
  submitters.push(...submitParent(submitterInfo))
  submitters.push(...submitRank(submitterInfo))
  submitters.push(...submitRealizations(submitterInfo))

  updatesInfo.results = await Promise.all(submitters)

  const failedResults = updatesInfo.results.filter(result => result.error)
  if (failedResults.length > 0) {
    const failedOperations = failedResults.map(result => ({
      field: result.field,
      action: result.action,
      details: result.error.details,
      message: result.error.message,
    }))

    // Group failures by field for better error reporting
    const failuresByField = failedOperations.reduce((acc, op) => {
      acc[op.field] = acc[op.field] || []
      acc[op.field].push(op)
      return acc
    }, {})

    const fieldsWithErrors = Object.keys(failuresByField).join(', ')
    throw createError(
      'Concept Save Error',
      `Failed to save changes to concept ${concept.name} in fields: ${fieldsWithErrors}`,
      {
        conceptName: concept.name,
        failedOperations,
        failuresByField,
      },
      failedResults[0].error
    )
  }

  return updatesInfo
}

export default submitStaged
