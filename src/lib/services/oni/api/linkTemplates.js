import { oniGet } from "./util/get"

const fetchLinkTemplates = async (conceptName, config) =>
  oniGet(config, ["linktemplates", "concept", conceptName])

export { fetchLinkTemplates }
