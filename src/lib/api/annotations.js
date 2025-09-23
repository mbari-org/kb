import { annosaurusGet, annosaurusPost, annosaurusPut } from '@/lib/services/annosaurus/methods'

const getConceptAnnotations = async (config, conceptName) =>
  annosaurusGet(config, ['fast', 'concept', conceptName])

const getConceptAnnotationsCount = async (config, conceptName) => {
  const { error, payload } = await annosaurusPost(config, ['fast', 'count'], {
    concepts: [conceptName],
  })
  return { error, result: payload?.content?.count }
}

const putConceptAnnotation = async (config, payload) =>
  annosaurusPut(config, ['annotations', payload.observation_uuid], payload)

export { getConceptAnnotations, getConceptAnnotationsCount, putConceptAnnotation }
