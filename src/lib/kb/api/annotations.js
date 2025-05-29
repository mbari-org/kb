import { annosaurusGet, annosaurusPost, annosaurusPut } from '@/lib/services/annosaurus/methods'

const fetchConceptAnnotations = async (config, conceptName) =>
  annosaurusGet(config, ['fast', 'concept', conceptName])

const getConceptAnnotationCount = async (config, conceptName) => {
  const params = {
    concepts: [conceptName],
  }
  const { error, payload } = await annosaurusPost(config, ['fast', 'count'], params)
  return { error, count: payload?.content?.count }
}

const renameConceptAnnotations = async (config, payload) =>
  annosaurusPut(config, ['associations', 'toconcept', 'rename'], payload)

export { fetchConceptAnnotations, getConceptAnnotationCount, renameConceptAnnotations }
