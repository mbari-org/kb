import { oniGet, oniPut } from '@/lib/services/oni/methods'

const fetchHistory = async (config, type) => {
  const { error, payload } = await oniGet(config, ['history', type])
  return { error, payload: payload?.content }
}

const updatePendingHistory = async (config, approval, pendingId) =>
  oniPut(config, ['history', approval, pendingId])

export { fetchHistory, updatePendingHistory }
