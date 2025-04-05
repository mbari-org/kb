import { oniGet } from '@/lib/services/oni/methods'

const fetchLinkRealizations = async (conceptName, config) =>
  oniGet(config, ['linkRealizations', 'concept', conceptName])

export { fetchLinkRealizations }
