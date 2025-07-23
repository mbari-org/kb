import submitAliases from './submitAliases'
import submitDetail from './submitDetail'
import submitMedia from './submitMedia'
import submitRealizations from './submitRealizations'
import submitStructure from './submtiStructure'

import { createUpdatesInfo } from '@/contexts/panels/concepts/staged/edit/stateUpdates'

const submitStaged = async (apiPayload, concept, initialState, stagedState) => {
  const updatesInfo = createUpdatesInfo(initialState, stagedState)

  const submitterInfo = [apiPayload, { concept, updatesInfo }]

  const submitters = []
  submitters.push(...submitAliases(submitterInfo))
  submitters.push(...submitDetail(submitterInfo))
  submitters.push(...submitMedia(submitterInfo))
  submitters.push(...submitRealizations(submitterInfo))
  submitters.push(...submitStructure(submitterInfo))

  updatesInfo.results = await Promise.all(submitters)

  if (updatesInfo.results.some(result => result.error)) {
    throw new Error('Failed to save concept changes')
  }

  return updatesInfo
}

export default submitStaged
