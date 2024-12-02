import { oniGet } from "./util/get"

const fetchLinkTemplates = async (conceptName, config) =>
  oniGet(config, ["linkTemplates", "concept", conceptName])

export { fetchLinkTemplates }
