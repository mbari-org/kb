import { oniGet } from './methods'

const fetchLinkRealizations = async (conceptName, config) =>
  oniGet(config, ['linkRealizations', 'concept', conceptName])

export { fetchLinkRealizations }
