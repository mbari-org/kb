import { annosaurusGet, annosaurusPost, annosaurusPut } from '@/lib/services/annosaurus/methods'

const getConceptAnnotations = async (config, conceptName) =>
  annosaurusGet(config, ['fast', 'concept', conceptName])

const getConceptAnnotationCount = async (config, conceptName) =>
  annosaurusPost(config, ['fast', 'count'], {
    concepts: [conceptName],
  })

const putConceptAnnotation = async (config, payload) =>
  annosaurusPut(config, ['annotations', payload.observation_uuid], payload)

const renameToConceptAnnotations = async (config, payload) =>
  annosaurusPut(config, ['associations', 'toconcept', 'rename'], payload)

export { getConceptAnnotationCount, getConceptAnnotations, putConceptAnnotation, renameToConceptAnnotations }
