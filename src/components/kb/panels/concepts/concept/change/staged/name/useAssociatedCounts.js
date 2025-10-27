import { use, useCallback, useEffect, useMemo, useState } from 'react'

import { getConceptAnnotationsCount } from '@/lib/kb/api/annotations'
import { getToConceptAssociationsCount } from '@/lib/kb/api/associations'
import {
  getConceptTemplateCount,
  getToConceptTemplateCount,
} from '@/lib/kb/api/linkTemplates'
import { getConceptObservationsCount } from '@/lib/kb/api/observations'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { pluralCount } from '@/lib/utils'

export const ASSOCIATED_ACTIONS = {
  DELETE: 'onDelete',
  RENAME: 'onRename',
}

const ON_ACTION = {
  REASSIGN: 'Reassign',
  REMOVE: 'Remove',
}

export const associatedMessages = (action, counts) => {
  const removalMessages = []
  const reassignmentMessages = []

  counts.forEach(({ message, value, onDelete, onRename }) => {
    if (value > 0) {
      const actionValue = action === ASSOCIATED_ACTIONS.DELETE ? onDelete : onRename
      if (actionValue === ON_ACTION.REMOVE) {
        removalMessages.push(`${actionValue}: ${message}`)
      }
      if (actionValue === ON_ACTION.REASSIGN) {
        reassignmentMessages.push(`${actionValue}: ${message}`)
      }
    }
  })

  return { removalMessages, reassignmentMessages }
}

const useAssociatedCounts = () => {
  const { concept } = use(ConceptContext)
  const { apiFns } = use(ConfigContext)
  const { getReferences } = use(PanelDataContext)

  const [associatedCounts, setAssociatedCounts] = useState(null)

  const apiFn = useCallback(
    fn => apiFns.apiResult(fn, concept.name),
    [apiFns, concept.name])

  const API_COUNTS = useMemo(
    () => [
      {
        title: 'Concept Annotation',
        fn: () => apiFn(getConceptAnnotationsCount),
        onDelete: ON_ACTION.REMOVE,
        onRename: ON_ACTION.REASSIGN,
      },
      {
        title: 'ToConcept Association',
        fn: () => apiFn(getToConceptAssociationsCount),
        onDelete: ON_ACTION.REMOVE,
        onRename: ON_ACTION.REASSIGN,
      },
      {
        title: 'Concept Observation',
        fn: () => apiFn(getConceptObservationsCount),
        onDelete: ON_ACTION.REMOVE,
        onRename: ON_ACTION.REASSIGN,
      },
      {
        title: 'Concept Template',
        fn: () => apiFn(getConceptTemplateCount),
        onDelete: ON_ACTION.REMOVE,
        onRename: ON_ACTION.REASSIGN,
      },
      {
        title: 'ToConcept Template',
        fn: () => apiFn(getToConceptTemplateCount),
        onDelete: ON_ACTION.REASSIGN,
        onRename: ON_ACTION.REASSIGN,
      },
      {
        title: 'Concept Reference',
        fn: () => getReferences(concept.name).length,
        onDelete: ON_ACTION.REMOVE,
        onRename: ON_ACTION.REMOVE,
      },
    ],
    [apiFn, getReferences, concept.name]
  )

  useEffect(() => {
    const fetchCounts = async () => {
      const counts = []
      for (const { title, fn, onDelete, onRename } of API_COUNTS) {
        const value = await fn()
        counts.push({ message: pluralCount(value, title), value, onDelete, onRename })
      }

      setAssociatedCounts(counts)
    }
    fetchCounts()
  }, [API_COUNTS])

  return associatedCounts
}

export default useAssociatedCounts
