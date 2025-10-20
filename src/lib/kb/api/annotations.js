import { annosaurusGet, annosaurusPost, annosaurusPut } from '@/lib/services/annosaurus/methods'

const getConceptAnnotations = async (config, conceptName) =>
  annosaurusGet({ config, path: ['fast', 'concept', conceptName] })

const getConceptAnnotationsCount = async (config, conceptName) => {
  const { error, payload } = await annosaurusPost({ config, path: ['fast', 'count'], data: {
    concepts: [conceptName],
  } })
  return { error, result: payload?.content?.count }
}

const putConceptAnnotation = async (config, payload) =>
  annosaurusPut({ config, path: ['annotations', payload.observation_uuid], data: payload })

export { getConceptAnnotations, getConceptAnnotationsCount, putConceptAnnotation }
