import { renameConceptAnnotations } from '@/lib/kb/api/annotations'
import { renameConceptObservations } from '@/lib/kb/api/observations'

const renameConceptAssociations = async (config, payload) =>
  Promise.all([
    renameConceptAnnotations(config, payload),
    renameConceptObservations(config, payload),
  ])

export { renameConceptAssociations }
