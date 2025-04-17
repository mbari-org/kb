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

const sendPendingAction = async (config, action, pendingId) =>
  oniPut(config, ['history', action, pendingId])

export { fetchHistory, sendPendingAction }
