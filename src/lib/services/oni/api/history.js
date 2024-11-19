import { oniGet } from "./util/get"

const fetchPendingHistory = async config => {
  const { content } = await oniGet(config, ["history", "pending"])
  return content
}

export { fetchPendingHistory }
