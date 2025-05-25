import { oniGet, oniPut } from '@/lib/services/oni/methods'

const getConceptHistory = async (config, conceptName) =>
  oniGet(config, ['history', 'concept', conceptName])

const getHistory = async (config, type, params) => {
  const { error, payload } = await oniGet(config, ['history', type], params)
  return { error, payload: payload?.content }
}

const getHistoryCount = async (config, type) => {
  const { error, payload } = await oniGet(config, ['history', type, 'count'])
  return { error, result: payload?.count }
}

const updatePendingHistoryItem = async (config, approval, pendingId) =>
  oniPut(config, ['history', approval, pendingId])

export { getConceptHistory, getHistory, getHistoryCount, updatePendingHistoryItem }
