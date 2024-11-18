import { oniGet } from "./get"

const fetchNames = async config => {
  const { content } = await oniGet(config, ["names"])
  return content
}

const fetchPendingHistory = async config => {
  const { content } = await oniGet(config, ["history", "pending"])
  return content
}
const fetchRoot = async config => oniGet(config, ["concept", "query", "root"])

export { fetchNames, fetchPendingHistory, fetchRoot }
