import { oniGet } from "./util/get"

const fetchPendingHistory = async config => {
  const { payload } = await oniGet(config, ["history", "pending"])
  return payload.content
}

export { fetchPendingHistory }
