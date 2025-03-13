import updateAliases from './updateAliases'
import updateDetail from './updateDetail'
import updateMedia from './updateMedia'
import updateName from './updateName'
import updateStructure from './updateStructure'

import { stateChange } from '@/contexts/concept/lib/edit/stateChange'

const submitter = config => async (submitFn, params) => await submitFn(config, params)

const submitUpdates = async (config, concept, initialState, stagedState) => {
  const submit = submitter(config, concept)
  const updates = stateChange(initialState, stagedState)

  const submitters = []

  submitters.push(...updateAliases(concept, updates, submit))
  submitters.push(...updateDetail(concept, updates, submit))
  submitters.push(...updateMedia(concept, updates, submit))
  submitters.push(...updateName(concept, updates, submit))
  submitters.push(...updateStructure(concept, updates, submit))

  return Promise.all(submitters.map(submitter => submitter()))
}

export default submitUpdates
