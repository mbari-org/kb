import { annosaurusGet, annosaurusPost } from '@/lib/services/annosaurus/methods'

const fetchConceptAnnotations = async (config, conceptName) =>
  annosaurusGet(config, ['fast', 'concept', conceptName])

const getConceptAnnotationCount = async (config, conceptName) => {
  const params = {
    concepts: [conceptName],
  }
  const { error, payload } = await annosaurusPost(config, ['fast', 'count'], params)
  return { error, count: payload.content.count }
}

export { fetchConceptAnnotations, getConceptAnnotationCount }
