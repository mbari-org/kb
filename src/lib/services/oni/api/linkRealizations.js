import { oniGet } from "./util"

const fetchLinkRealizations = async (conceptName, config) =>
  oniGet(config, ["linkRealizations", "concept", conceptName])

export { fetchLinkRealizations }
