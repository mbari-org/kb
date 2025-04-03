import { oniGet } from './methods'

const fetchLinkTemplates = async (conceptName, config) =>
  oniGet(config, ['linktemplates', 'concept', conceptName])

export { fetchLinkTemplates }
