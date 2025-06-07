import { annosaurusPut } from '@/lib/services/annosaurus/methods'

const renameToConceptObservations = async (config, payload) =>
  annosaurusPut(config, ['observations', 'concept', 'rename'], payload)

export { renameToConceptObservations }
