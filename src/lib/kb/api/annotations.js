import { annosaurusGet } from '@/lib/services/annosaurus/methods'

const fetchConceptAnnotations = async (config, conceptName) =>
  annosaurusGet(config, ['fast', 'concept', conceptName])

export { fetchConceptAnnotations }
