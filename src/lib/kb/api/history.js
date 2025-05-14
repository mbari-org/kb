import { oniGet, oniPut } from '@/lib/services/oni/methods'

const fetchHistory = async (config, action) => {
  const { error, payload } = await oniGet(config, ['history', action])

  // CxInc Tmp bypass history error
  if (error) {
    console.log('CxTmp bypassing history error', error)
    return { payload: [] }
  }

  return { payload: payload?.content }
}

const updatePendingHistory = async (config, approval, pendingId) =>
  oniPut(config, ['history', approval, pendingId])

export { fetchHistory, updatePendingHistory }
