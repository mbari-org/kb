import { annosaurusGet } from './methods'

const countAnnotations = async (config, conceptName) =>
  annosaurusGet(config, ['fast', 'concept', conceptName])

export { countAnnotations }
