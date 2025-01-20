import { oniGet, oniPut } from "./util"

const fetchHistory = async (config, action) => {
  const { error, payload } = await oniGet(config, ["history", action])
  return { error, payload: payload.content }
}

const sendPendingAction = async (config, action, pendingId) =>
  oniPut(config, ["history", action, pendingId])

export { fetchHistory, sendPendingAction }
