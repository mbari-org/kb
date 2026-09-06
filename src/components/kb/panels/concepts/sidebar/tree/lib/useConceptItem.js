import { use, useCallback, useMemo } from 'react'

import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { ACTION } from '@/lib/constants'
import { HISTORY_FIELD } from '@/lib/constants/historyField.js'

const KEY_SEPARATOR = String.fromCharCode(0)
const childKey = (parentName, childName) => [parentName, childName].join(KEY_SEPARATOR)

const useConceptItem = () => {
  const { pendingHistory } = use(PanelDataContext)
  const { getConcept } = use(TaxonomyContext)

  const pendingConceptNames = useMemo(() => new Set(pendingHistory.map(history => history.concept)), [pendingHistory])

  const pendingChildKeys = useMemo(
    () =>
      new Set(
        pendingHistory
          .filter(
            history =>
              history.field === HISTORY_FIELD.CHILD &&
              (history.action === ACTION.ADD || history.action === ACTION.DELETE)
          )
          .map(history =>
            childKey(history.concept, history.action === ACTION.ADD ? history.newValue : history.oldValue)
          )
      ),
    [pendingHistory]
  )

  const createConceptItem = useCallback(
    (taxonomy, itemId) => {
      const concept = getConcept(itemId)
      if (!concept) return null

      const hasPending =
        pendingConceptNames.has(concept.name) || pendingChildKeys.has(childKey(concept.parent, concept.name))

      return {
        id: concept.name,
        label:
          concept.alternateNames.length === 0 ? concept.name : `${concept.name} (${concept.alternateNames.join(', ')})`,
        hasPending,
        mediaCount: concept.media?.length || 0,
        parent: concept.parent,
      }
    },
    [getConcept, pendingConceptNames, pendingChildKeys]
  )

  return createConceptItem
}

export default useConceptItem
