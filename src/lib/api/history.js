import { oniGet, oniPut } from '@/lib/services/oni/methods'
import { paramsQs } from '@/lib/services/params'

const getConceptHistory = async (config, conceptName) =>
  oniGet({ config, path: ['history', 'concept', conceptName] })

const getHistory = async (config, [type, params]) => oniGet({ config, path: ['history', type], qs: paramsQs(params) })

const getHistoryCount = async (config, type) => {
  const { error, payload } = await oniGet({ config, path: ['history', type, 'count'] })
  return { error, result: payload?.count }
}

const updatePendingItem = async (config, [approval, pendingId]) =>
  oniPut({ config, path: ['history', approval, pendingId] })

export { getConceptHistory, getHistory, getHistoryCount, updatePendingItem }
