import { annosaurusPut } from '@/lib/services/annosaurus/methods'

const updateAssociations = async (config, payload) =>
  annosaurusPut(config, ['associations', 'toConcept'], payload)

export { updateAssociations }
