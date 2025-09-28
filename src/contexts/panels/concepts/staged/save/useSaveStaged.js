import { use, useCallback } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'
import UserContext from '@/contexts/user/UserContext'

import submitStaged from '@/contexts/panels/concepts/staged/save/submitStaged'

import applyAliases from '@/contexts/panels/concepts/staged/save/applier/applyAliases'
import applyAuthor from '@/contexts/panels/concepts/staged/save/applier/applyAuthor'
import applyChildren from '@/contexts/panels/concepts/staged/save/applier/applyChildren'
import applyMedia from '@/contexts/panels/concepts/staged/save/applier/applyMedia'
import applyParent from '@/contexts/panels/concepts/staged/save/applier/applyParent'
import applyRank from '@/contexts/panels/concepts/staged/save/applier/applyRank'
import applyRealizations from '@/contexts/panels/concepts/staged/save/applier/applyRealizations'

import { getConcept } from '@/lib/api/concept'
import { isAdmin } from '@/lib/auth/role'

const useSaveStaged = () => {
  const { apiFns } = use(ConfigContext)
  const { closeModal, setProcessing } = use(ConceptModalContext)
  const { concept: staleConcept, initialState, setConcept, stagedState } = use(ConceptContext)
  const { updateSelected } = use(SelectedContext)
  const { refreshConcept } = use(TaxonomyContext)
  const { user } = use(UserContext)

  return useCallback(async () => {
    setProcessing('Saving concept...')

    let updatesInfo
    try {
      updatesInfo = await submitStaged(
        apiFns.apiPayload,
        staleConcept,
        initialState,
        stagedState
      )
    } catch (error) {
      setProcessing(false)
      throw error
    }

    const { hasUpdated, results } = updatesInfo

    const conceptName = hasUpdated('name')
      ? updatesInfo.updatedValue('name').value
      : staleConcept.name

    const freshConcept = await apiFns.apiPayload(getConcept, conceptName)

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
        const trackerWithRole = { ...tracker, isAdmin: isAdmin(user) }
        apply(freshConcept, trackerWithRole)
      }
    })

    const { concept: updatedConcept } = await refreshConcept(freshConcept, staleConcept)

    await setConcept(updatedConcept)

    updateSelected({ concept: updatedConcept.name })

    closeModal()

    setProcessing(false)
  }, [
    apiFns,
    closeModal,
    initialState,
    refreshConcept,
    setConcept,
    setProcessing,
    stagedState,
    staleConcept,
    updateSelected,
    user,
  ])
}

export default useSaveStaged
