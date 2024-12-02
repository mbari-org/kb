import { oniGet } from "./util/get"

const fetchLinkRealizations = async (conceptName, config) =>
  oniGet(config, ["linkRealizations", "concept", conceptName])

export { fetchLinkRealizations }
