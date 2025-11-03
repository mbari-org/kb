import { use, useCallback } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { capitalize } from '@/lib/utils'

import { PENDING } from '@/lib/constants'
import processPendingApproval from '@/lib/kb/pending/processPendingApproval'

const useUpdatedPending = () => {
  const { concept: staleConcept, pending, setConcept } = use(ConceptContext)
  const { setProcessing } = use(ConceptModalContext)
  const { apiFns } = use(ConfigContext)
  const { updateSelected } = use(SelectedContext)
  const { conceptEditsRefresh, getConcept } = use(TaxonomyContext)

  return useCallback(
    async pendingConfirm => {
      const { approval, pendingIds: propIds, pendingItems: propItems } = pendingConfirm

      const pendingConcept = pending(PENDING.DATA.CONCEPT)

      const items = (
        propItems
          ? propItems
          : propIds.map(pendingId => pendingConcept.find(item => item.id === pendingId))
      ).filter(Boolean)

      setProcessing(`${capitalize(approval)} pending changes...`)

      const { updated } = await processPendingApproval({
        approval,
        deps: {
          apiFns,
          conceptEditsRefresh,
          getConcept,
          refreshHistory: null,
          updateSelected,
        },
        items,
      })

      if (updated.includes(staleConcept.name)) {
        const { concept: updatedConcept } = await conceptEditsRefresh(
          getConcept(staleConcept.name),
          staleConcept
        )
        await setConcept(updatedConcept)
      }

      setProcessing(false)

      return pendingConcept.length !== items.length
    },
    [
      apiFns,
      conceptEditsRefresh,
      getConcept,
      pending,
      setConcept,
      setProcessing,
      staleConcept,
      updateSelected,
    ]
  )
}

export default useUpdatedPending
