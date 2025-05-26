import { annosaurusPut } from '@/lib/services/annosaurus/methods'

const renameConceptObservations = async (config, payload) =>
  annosaurusPut(config, ['observations', 'concept', 'rename'], payload)

export { renameConceptObservations }
