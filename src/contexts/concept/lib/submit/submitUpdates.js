import updateDetail from './updateDetail'
import updateMedia from './updateMedia'
import updateName from './updateName'
import updateStructure from './updateStructure'

import { stateChange } from '@/contexts/concept/lib/edit/stateChange'

const processor = (config, concept) => async (submitter, updates, result) => {
  if (result.error)
    return {
      error: result.error,
      concept,
    }

  const { error, _payload } = await submitter(config, concept.name, updates)
  const updatedConcept = { ...concept, ...updates }

  return { error, updatedConcept }
}

const submitUpdates = async (config, concept, initialState, stagedState) => {
  const process = processor(config, concept)
  const updates = stateChange(initialState, stagedState)

  let result = { error: null, concept: { ...concept } }
  result = updateDetail(updates, result, process)
  result = updateMedia(updates, result, process)
  result = updateStructure(updates, result, process)
  result = updateName(updates, result, process)

  await new Promise(resolve => setTimeout(resolve, 5000))

  return result
}

export default submitUpdates
