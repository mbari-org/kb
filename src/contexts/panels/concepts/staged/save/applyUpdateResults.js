import { CONCEPT } from '@/lib/constants'

import applyAliasResults from '@/contexts/panels/concepts/staged/save/applier/applyAliasResults'
import applyAuthorResults from '@/contexts/panels/concepts/staged/save/applier/applyAuthorResults'
import applyChildrenResults from '@/contexts/panels/concepts/staged/save/applier/applyChildrenResults'
import applyParentResults from '@/contexts/panels/concepts/staged/save/applier/applyParentResults'
import applyRankResults from '@/contexts/panels/concepts/staged/save/applier/applyRankResults'
import applyRealizationResults from '@/contexts/panels/concepts/staged/save/applier/applyRealizationResults'

const applyUpdateResults = async ({ freshConcept, isAdmin, staleConcept, updatesInfo }) => {

  freshConcept.aliases = staleConcept.aliases.map(alias => ({ ...alias }))
  freshConcept.alternateNames = [...staleConcept.alternateNames]
  freshConcept.children = [...staleConcept.children]
  freshConcept.parent = staleConcept.parent
  if (freshConcept.linkRealizations) {
    freshConcept.realizations = freshConcept.linkRealizations
    delete freshConcept.linkRealizations
  }

  const appliers = {
    [CONCEPT.FIELD.ALIASES]: applyAliasResults,
    [CONCEPT.FIELD.AUTHOR]: applyAuthorResults,
    [CONCEPT.FIELD.CHILDREN]: applyChildrenResults,
    [CONCEPT.FIELD.PARENT]: applyParentResults,
    [CONCEPT.FIELD.RANK]: applyRankResults,
    [CONCEPT.FIELD.REALIZATIONS]: applyRealizationResults,
  }

  updatesInfo.results.forEach(result =>
    appliers[result.field]?.({ concept: freshConcept, isAdmin, result })
  )
}

export default applyUpdateResults
