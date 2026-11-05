import { use, useMemo } from 'react'

import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { ACTION } from '@/lib/constants'
import { HISTORY_FIELD } from '@/lib/constants/historyField.js'

const KEY_SEPARATOR = String.fromCharCode(0)
const childKey = (parentName, childName) => [parentName, childName].join(KEY_SEPARATOR)

const itemLabel = concept =>
  concept.alternateNames.length === 0 ? concept.name : `${concept.name} (${concept.alternateNames.join(', ')})`

const useConceptItem = itemId => {
  const { pendingHistory } = use(PanelDataContext)
  const { getConcept } = use(TaxonomyContext)

  const pendingConceptNames = useMemo(() => new Set(pendingHistory.map(history => history.concept)), [pendingHistory])

  const pendingChildActions = useMemo(
    () =>
      new Map(
        pendingHistory
          .filter(
            history =>
              history.field === HISTORY_FIELD.CHILD &&
              (history.action === ACTION.ADD || history.action === ACTION.DELETE)
          )
          .map(history => [
            childKey(history.concept, history.action === ACTION.ADD ? history.newValue : history.oldValue),
            history.action,
          ])
      ),
    [pendingHistory]
  )

  const concept = getConcept(itemId)

  return useMemo(() => {
    if (!concept) return null

    const childAction = pendingChildActions.get(childKey(concept.parent, concept.name))
    const pendingAction = childAction ?? (pendingConceptNames.has(concept.name) ? ACTION.EDIT : null)

    return {
      label: itemLabel(concept),
      mediaCount: concept.media?.length || 0,
      pendingAction,
    }
  }, [concept, pendingConceptNames, pendingChildActions])
}

export default useConceptItem
