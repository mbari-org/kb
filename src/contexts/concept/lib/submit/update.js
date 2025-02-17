import detailUpdates from './detailUpdates'
import mediaUpdates from './mediaUpdates'
import nameUpdates from './nameUpdates'
import structureUpdates from './structureUpdates'

import { isEmpty, prune } from '@/lib/util'

const update = async params => {
  const { concept, config, updates } = params
  const nextResult = updateProcessor(concept, config)

  let result = { error: null, concept: { ...concept } }

  result = detailUpdates(updates, result, nextResult)
  result = mediaUpdates(updates, result, nextResult)
  result = structureUpdates(updates, result, nextResult)

  result = nameUpdates(updates, result, nextResult)

  return result
}

const updateProcessor = (concept, config) => async (result, conceptUpdates, updateFn) => {
  if (result.error)
    return {
      error: result.error,
      concept,
    }

  const updates = prune(conceptUpdates)
  if (isEmpty(updates)) {
    return { concept }
  }

  const { error, _payload } = await updateFn(config, concept.name, updates)
  const updatedConcept = { ...concept, ...updates }

  return { error, updatedConcept }
}

export default update
