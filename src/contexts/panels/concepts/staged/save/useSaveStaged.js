import { use, useCallback } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import submitStaged from '@/contexts/panels/concepts/staged/save/submitStaged'

import applyAliases from '@/contexts/panels/concepts/staged/save/applier/applyAliases'
import applyAuthor from '@/contexts/panels/concepts/staged/save/applier/applyAuthor'
import applyChildren from '@/contexts/panels/concepts/staged/save/applier/applyChildren'
import applyMedia from '@/contexts/panels/concepts/staged/save/applier/applyMedia'
import applyParent from '@/contexts/panels/concepts/staged/save/applier/applyParent'
import applyRank from '@/contexts/panels/concepts/staged/save/applier/applyRank'
import applyRealizations from '@/contexts/panels/concepts/staged/save/applier/applyRealizations'

import { getConcept as apiConcept } from '@/lib/api/concept'

const useSaveStaged = () => {
  const { apiFns } = use(ConfigContext)
  const { closeModal, setProcessing } = use(ConceptModalContext)
  const { concept: staleConcept, initialState, resetConcept, stagedState } = use(ConceptContext)
  const { updateSelected } = use(SelectedContext)
  const { refreshConcept } = use(TaxonomyContext)

  return useCallback(async () => {
    setProcessing('Saving concept...')

    const updatesInfo = await submitStaged(
      apiFns.apiPayload,
      staleConcept,
      initialState,
      stagedState
    )
    const { hasUpdated, results } = updatesInfo

    const conceptName = hasUpdated('name')
      ? updatesInfo.updatedValue('name').value
      : staleConcept.name

    const freshConcept = await apiFns.apiPayload(apiConcept, conceptName)

    freshConcept.aliases = staleConcept.aliases.map(alias => ({ ...alias }))
    freshConcept.alternateNames = [...staleConcept.alternateNames]
    freshConcept.children = [...staleConcept.children]
    freshConcept.parent = staleConcept.parent

    const appliers = {
      aliases: (concept, tracker) => applyAliases(concept, tracker),
      author: (concept, tracker) => applyAuthor(concept, tracker),
      children: (concept, tracker) => applyChildren(concept, tracker),
      media: (concept, tracker) => applyMedia(concept, tracker),
      parent: (concept, tracker) => applyParent(concept, tracker),
      rank: (concept, tracker) => applyRank(concept, tracker),
      realizations: (concept, tracker) => applyRealizations(concept, tracker),
    }

    results.forEach(tracker => {
      const apply = appliers[tracker.field]
      if (apply) {
        apply(freshConcept, tracker)
      }
    })

    const { concept: updatedConcept } = await refreshConcept(freshConcept, staleConcept)

    await resetConcept(updatedConcept)

    updateSelected({ concept: updatedConcept.name })

    closeModal()

    setProcessing(false)
  }, [
    setProcessing,
    apiFns,
    staleConcept,
    initialState,
    stagedState,
    refreshConcept,
    resetConcept,
    updateSelected,
    closeModal,
  ])
}

export default useSaveStaged
