import { oniGet } from "./util/get"

const fetchNames = async config => {
  const { error, payload } = await oniGet(config, ["names"])
  return { error, payload: payload.content }
}

const fetchRoot = async config => oniGet(config, ["concept", "query", "root"])

export { fetchNames, fetchRoot }
