import { annosaurusGet, annosaurusPut } from '@/lib/services/annosaurus/methods'

const getToConceptAssociationsCount = async (config, conceptName) => {
  const { error, payload } = await annosaurusGet({ config, path: ['associations', 'toconcept', 'count', conceptName] })
  return { error, result: payload?.count }
}

const renameToConceptAssociations = async (config, payload) =>
  annosaurusPut({ config, path: ['associations', 'toconcept', 'rename'], data: payload })

export { getToConceptAssociationsCount, renameToConceptAssociations }
