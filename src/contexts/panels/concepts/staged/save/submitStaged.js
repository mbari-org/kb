import submitAliases from '@/contexts/panels/concepts/staged/save/submitter/submitAliases'
import submitAuthor from '@/contexts/panels/concepts/staged/save/submitter/submitAuthor'
import submitChildren from '@/contexts/panels/concepts/staged/save/submitter/submitChildren'
import submitMedia from '@/contexts/panels/concepts/staged/save/submitter/submitMedia'
import submitName from '@/contexts/panels/concepts/staged/save/submitter/submitName'
import submitParent from '@/contexts/panels/concepts/staged/save/submitter/submitParent'
import submitRank from '@/contexts/panels/concepts/staged/save/submitter/submitRank'
import submitRealizations from '@/contexts/panels/concepts/staged/save/submitter/submitRealizations'

import { createUpdatesInfo } from '@/contexts/panels/concepts/staged/edit/stateUpdates'

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

  if (updatesInfo.results.some(result => result.error)) {
    throw new Error('Failed to save concept changes')
  }

  return updatesInfo
}

export default submitStaged
