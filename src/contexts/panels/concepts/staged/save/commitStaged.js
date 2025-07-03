import saveAliases from './saveAliases'
import saveDetail from './saveDetail'
import saveMedia from './saveMedia'
import saveStructure from './saveStructure'

import { updateInfo as stateUpdateInfo } from '@/contexts/panels/concepts/staged/edit/stateUpdates'

const commitStaged = async (apiPayload, concept, initialState, stagedState) => {
  const updateInfo = stateUpdateInfo(initialState, stagedState)

  const submitterInfo = [apiPayload, { concept, updateInfo }]

  const submitters = []
  submitters.push(...saveAliases(submitterInfo))
  submitters.push(...saveDetail(submitterInfo))
  submitters.push(...saveMedia(submitterInfo))
  submitters.push(...saveStructure(submitterInfo))

  updateInfo.results = await Promise.all(submitters)

  if (updateInfo.results.some(result => result.error)) {
    throw new Error('Failed to save concept changes')
  }

  return updateInfo
}

export default commitStaged
