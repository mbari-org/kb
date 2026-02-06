import { getConcept } from '@/lib/api/concept'
import { isAdmin } from '@/lib/auth/role'
import { CONCEPT } from '@/lib/constants'

import applyAliases from '@/contexts/panels/concepts/staged/save/applier/applyAliases'
import applyAuthor from '@/contexts/panels/concepts/staged/save/applier/applyAuthor'
import applyChildren from '@/contexts/panels/concepts/staged/save/applier/applyChildren'
import applyMedia from '@/contexts/panels/concepts/staged/save/applier/applyMedia'
import applyParent from '@/contexts/panels/concepts/staged/save/applier/applyParent'
import applyRank from '@/contexts/panels/concepts/staged/save/applier/applyRank'
import applyRealizations from '@/contexts/panels/concepts/staged/save/applier/applyRealizations'

const applyResults = async (updatesContext, updatesInfo) => {
  const { apiFns, staleConcept, user } = updatesContext
  const conceptName =
    updatesInfo?.updatedValue(CONCEPT.FIELD.NAME)?.value || staleConcept.name

  const freshConcept = await apiFns.apiPayload(getConcept, conceptName)

  freshConcept.aliases = staleConcept.aliases.map(alias => ({ ...alias }))
  freshConcept.alternateNames = [...staleConcept.alternateNames]
  freshConcept.children = [...staleConcept.children]
  freshConcept.parent = staleConcept.parent
  if (freshConcept.linkRealizations) {
    freshConcept.realizations = freshConcept.linkRealizations
    delete freshConcept.linkRealizations
  }

  const appliers = {
    [CONCEPT.FIELD.ALIASES]: applyAliases,
    [CONCEPT.FIELD.AUTHOR]: applyAuthor,
    [CONCEPT.FIELD.CHILDREN]: applyChildren,
    [CONCEPT.FIELD.MEDIA]: applyMedia,
    [CONCEPT.FIELD.PARENT]: applyParent,
    [CONCEPT.FIELD.RANK]: applyRank,
    [CONCEPT.FIELD.REALIZATIONS]: applyRealizations,
  }

  updatesInfo.results.forEach(tracker =>
    appliers[tracker.field]?.(freshConcept, { ...tracker, isAdmin: isAdmin(user) })
  )

  return freshConcept
}

export default applyResults
