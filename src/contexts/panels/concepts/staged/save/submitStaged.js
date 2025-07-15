import saveAliases from './saveAliases'
import saveDetail from './saveDetail'
import saveMedia from './saveMedia'
import saveRealizations from './saveRealizations'
import saveStructure from './saveStructure'

import { createUpdatesInfo } from '@/contexts/panels/concepts/staged/edit/stateUpdates'

const submitStaged = async (apiPayload, concept, initialState, stagedState) => {
  const updatesInfo = createUpdatesInfo(initialState, stagedState)

  const submitterInfo = [apiPayload, { concept, updatesInfo }]

  const submitters = []
  submitters.push(...saveAliases(submitterInfo))
  submitters.push(...saveDetail(submitterInfo))
  submitters.push(...saveMedia(submitterInfo))
  submitters.push(...saveRealizations(submitterInfo))
  submitters.push(...saveStructure(submitterInfo))

  updatesInfo.results = await Promise.all(submitters)

  if (updatesInfo.results.some(result => result.error)) {
    throw new Error('Failed to save concept changes')
  }

  return updatesInfo
}

export default submitStaged
