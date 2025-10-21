import { isAdmin } from '@/lib/auth/role'
import { getConcept } from '@/lib/kb/api/concept'

import applyAliases from '@/contexts/panels/concepts/staged/save/applier/applyAliases'
import applyAuthor from '@/contexts/panels/concepts/staged/save/applier/applyAuthor'
import applyChildren from '@/contexts/panels/concepts/staged/save/applier/applyChildren'
import applyMedia from '@/contexts/panels/concepts/staged/save/applier/applyMedia'
import applyParent from '@/contexts/panels/concepts/staged/save/applier/applyParent'
import applyRank from '@/contexts/panels/concepts/staged/save/applier/applyRank'
import applyRealizations from '@/contexts/panels/concepts/staged/save/applier/applyRealizations'

const applyResults = async (updatesContext, updatesInfo) => {
  const { apiFns, staleConcept, user } = updatesContext
  const conceptName = updatesInfo?.updatedValue('name')?.value || staleConcept.name

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

  updatesInfo.results.forEach(tracker => {
    const apply = appliers[tracker.field]
    if (apply) {
      const trackerWithRole = { ...tracker, isAdmin: isAdmin(user) }
      apply(freshConcept, trackerWithRole)
    }
  })

  return freshConcept
}

export default applyResults
