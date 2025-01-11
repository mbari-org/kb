import { oniGet } from "./util"

const fetchLinkTemplates = async (conceptName, config) =>
  oniGet(config, ["linktemplates", "concept", conceptName])

export { fetchLinkTemplates }
