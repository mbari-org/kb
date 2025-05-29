import { oniGet } from '@/lib/services/oni/methods'

const getConceptLinkRealizations = async (config, conceptName) =>
  oniGet(config, ['linkrealizations', 'concept', conceptName])

export { getConceptLinkRealizations }
