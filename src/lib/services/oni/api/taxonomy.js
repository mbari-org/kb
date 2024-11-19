import { oniGet } from "./util/get"

const fetchNames = async config => {
  const { content } = await oniGet(config, ["names"])
  return content
}

const fetchRoot = async config => oniGet(config, ["concept", "query", "root"])

export { fetchNames, fetchRoot }
