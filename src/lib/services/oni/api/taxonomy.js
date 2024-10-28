import { oniFetchJson } from "./fetch"

const fetchNames = async config => {
  const { content } = await oniFetchJson(config, ["names"])
  return content
}

const fetchPendingHistory = async config => {
  const { content } = await oniFetchJson(config, ["history", "pending"])
  return content
}
const fetchRoot = async config =>
  oniFetchJson(config, ["concept", "query", "root"])

export { fetchNames, fetchPendingHistory, fetchRoot }
