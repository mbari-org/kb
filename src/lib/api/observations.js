import { annosaurusGet, annosaurusPut } from '@/lib/services/annosaurus/methods'

const getConceptObservationsCount = async (config, conceptName) => {
  const { error, payload } = await annosaurusGet({ config, path: ['observations', 'concept', 'count', conceptName] })
  return { error, result: payload?.count }
}

const renameConceptObservations = async (config, payload) =>
  annosaurusPut({ config, path: ['observations', 'concept', 'rename'], data: payload })

export { getConceptObservationsCount, renameConceptObservations }
