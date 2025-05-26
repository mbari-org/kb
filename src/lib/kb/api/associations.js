import { annosaurusPut } from '@/lib/services/annosaurus/methods'

const renameConceptAssociations = async (config, payload) =>
  annosaurusPut(config, ['associations', 'toconcept', 'rename'], payload)

export { renameConceptAssociations }
