import { oniGet } from "./util/get"

const fetchNames = async config => {
  const { payload } = await oniGet(config, ["names"])
  return payload.content
}

const fetchRoot = async config => {
  const { payload } = await oniGet(config, ["concept", "query", "root"])
  return payload
}

export { fetchNames, fetchRoot }
