import { use, useCallback, useEffect, useMemo, useState } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { pluralCount } from '@/lib/utils'
import { ASSOCIATION_CONFIG, ON_ACTION } from './associationConfig'

export const ASSOCIATED_ACTIONS = {
  DELETE: 'onDelete',
  RENAME: 'onRename',
}

export const associatedMessages = (action, counts) => {
  const removalMessages = []
  const reassignmentMessages = []

  counts.forEach(({ message, value, ON_DELETE, ON_RENAME }) => {
    if (value > 0) {
      const actionValue = action === ASSOCIATED_ACTIONS.DELETE ? ON_DELETE : ON_RENAME
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
    () => ASSOCIATION_CONFIG.map(({ title, countFn, renameFn, onDelete, onRename }) => {
      const fn = title === 'Concept Reference'
        ? () => getReferences(concept.name).length
        : () => apiFn(countFn)
      const boundRenameFn = renameFn ? payload => apiFns.apiPayload(renameFn, payload) : null
      return { title, fn, ON_DELETE: onDelete, ON_RENAME: onRename, renameFn: boundRenameFn }
    }),
    [apiFn, apiFns, getReferences, concept.name]
  )

  useEffect(() => {
    const fetchCounts = async () => {
      const counts = []
      for (const { title, fn, ON_DELETE, ON_RENAME, renameFn } of API_COUNTS) {
        const value = await fn()
        counts.push({
          message: pluralCount(value, title),
          value,
          ON_DELETE,
          ON_RENAME,
          renameFn,
        })
      }

      setAssociatedCounts(counts)
    }
    fetchCounts()
  }, [API_COUNTS])

  return associatedCounts
}

export default useAssociatedCounts
