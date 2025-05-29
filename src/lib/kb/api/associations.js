import { renameToConceptAnnotations } from '@/lib/kb/api/annotations'
import { renameToConceptObservations } from '@/lib/kb/api/observations'

const renameConceptAssociations = async (config, payload) =>
  Promise.all([
    renameToConceptAnnotations(config, payload),
    renameToConceptObservations(config, payload),
  ])

export { renameConceptAssociations }
