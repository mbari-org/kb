import { oniFetch } from "./fetch"

const fetchNames = async config => {
  const { content } = await oniFetch(config, ["names"])
  return content
}

const fetchRoot = async config => oniFetch(config, ["concept", "query", "root"])

export { fetchNames, fetchRoot }
