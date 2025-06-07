import { renameToConceptAnnotations } from '@/lib/api/annotations'
import { renameToConceptObservations } from '@/lib/api/observations'

const renameConceptAssociations = async (config, payload) =>
  Promise.all([
    renameToConceptAnnotations(config, payload),
    renameToConceptObservations(config, payload),
  ])

export { renameConceptAssociations }
