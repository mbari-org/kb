import { annosaurusPut } from '@/lib/services/annosaurus/methods'

const updateObservations = async (config, payload) =>
  annosaurusPut(config, ['observations', 'concept'], payload)

export { updateObservations }
