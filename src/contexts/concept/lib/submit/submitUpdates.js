import updateAliases from './updateAliases'
import updateDetail from './updateDetail'
import updateMedia from './updateMedia'
import updateStructure from './updateStructure'

import { updateInfo as stateUpdateInfo } from '@/contexts/concept/lib/edit/stateUpdates'

const submitUpdates = async (apiPayload, concept, initialState, stagedState) => {
  const updateInfo = stateUpdateInfo(initialState, stagedState)

  const submitterInfo = [apiPayload, { concept, updateInfo }]

  const submitters = []
  submitters.push(...updateAliases(submitterInfo))
  submitters.push(...updateDetail(submitterInfo))
  submitters.push(...updateMedia(submitterInfo))
  submitters.push(...updateStructure(submitterInfo))
  updateInfo.results = await Promise.all(submitters)

  return updateInfo
}

export default submitUpdates
