import { getConceptAnnotationsCount } from '@/lib/kb/api/annotations'
import { getToConceptAssociationsCount, renameToConceptAssociations } from '@/lib/kb/api/associations'
import {
  getConceptTemplateCount,
  getToConceptTemplateCount,
  renameToConceptTemplates,
} from '@/lib/kb/api/linkTemplates'
import { getConceptObservationsCount, renameConceptObservations } from '@/lib/kb/api/observations'

const REASSIGN = 'Reassign'
const REMOVE = 'Remove'

export const ON_ACTION = { REASSIGN, REMOVE }

export const ASSOCIATION_CONFIG = [
  {
    title: 'Concept Annotation',
    countFn: getConceptAnnotationsCount,
    renameFn: null,
    onDelete: REMOVE,
    onRename: REASSIGN,
  },
  {
    title: 'ToConcept Association',
    countFn: getToConceptAssociationsCount,
    renameFn: renameToConceptAssociations,
    onDelete: REMOVE,
    onRename: REASSIGN,
  },
  {
    title: 'Concept Observation',
    countFn: getConceptObservationsCount,
    renameFn: renameConceptObservations,
    onDelete: REMOVE,
    onRename: REASSIGN,
  },
  {
    title: 'Concept Template',
    countFn: getConceptTemplateCount,
    renameFn: null,
    onDelete: REMOVE,
    onRename: REASSIGN,
  },
  {
    title: 'ToConcept Template',
    countFn: getToConceptTemplateCount,
    renameFn: renameToConceptTemplates,
    onDelete: REASSIGN,
    onRename: REASSIGN,
  },
  {
    title: 'Concept Reference',
    countFn: null,
    renameFn: null,
    onDelete: REMOVE,
    onRename: REMOVE,
  },
]
