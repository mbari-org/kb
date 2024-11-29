import { oniGet } from "./util/get"

const fetchPendingHistory = async config => {
  const { error, payload } = await oniGet(config, ["history", "pending"])
  return { error, payload: payload.content }
}

export { fetchPendingHistory }
