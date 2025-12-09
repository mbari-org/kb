import { use, useCallback } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import processPendingApproval from '@/lib/concept/pending/processPendingApproval'
import { PENDING } from '@/lib/constants/pending.js'

import { CONFIG } from '@/config/js'

const { PROCESSING } = CONFIG

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

      setProcessing(PROCESSING.UPDATE, `{PROCESSING.ARG.PENDING} ${approval}`)

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

      setProcessing(PROCESSING.OFF)

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
