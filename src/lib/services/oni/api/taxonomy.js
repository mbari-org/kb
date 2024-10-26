import { oniFetch } from "./fetch"

const fetchNames = async config => {
  const { content } = await oniFetch(config, ["names"])
  return content
}

const fetchPendingHistory = async config => {
  const { content } = await oniFetch(config, ["history", "pending"])
  return content
}
const fetchRoot = async config => oniFetch(config, ["concept", "query", "root"])

export { fetchNames, fetchPendingHistory, fetchRoot }
