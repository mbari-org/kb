import { oniGet, oniPut } from "./util"

const fetchPendingHistory = async config => {
  const { error, payload } = await oniGet(config, ["history", "pending"])
  return { error, payload: payload.content }
}

const sendPendingAction = async (config, action, pendingId) =>
  oniPut(config, ["history", action, pendingId])

export { fetchPendingHistory, sendPendingAction }
