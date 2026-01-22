import { getConcept } from '@/lib/api/concept'
import { isAdmin } from '@/lib/auth/role'
import { CONCEPT } from '@/lib/constants'
import { isJsonEqual, pick } from '@/lib/utils'

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

  if (updatesInfo?.hasUpdated(CONCEPT.FIELD.MEDIA)) {
    const normalizeMedia = media =>
      (media || []).map(item =>
        pick(item, ['id', 'url', 'mediaType', 'caption', 'credit', 'isPrimary'])
      )
    const stagedMedia = normalizeMedia(updatesInfo.updatedValue(CONCEPT.FIELD.MEDIA))
    const freshMedia = normalizeMedia(freshConcept.media)

    if (!isJsonEqual(stagedMedia, freshMedia)) {
      freshConcept.media = staleConcept.media.map(mediaItem => ({ ...mediaItem }))
    }
  }

  freshConcept.aliases = staleConcept.aliases.map(alias => ({ ...alias }))
  freshConcept.alternateNames = [...staleConcept.alternateNames]
  freshConcept.children = [...staleConcept.children]
  freshConcept.parent = staleConcept.parent
  if (freshConcept.linkRealizations) {
    freshConcept.realizations = freshConcept.linkRealizations
    delete freshConcept.linkRealizations
  }

  const appliers = {
    [CONCEPT.FIELD.ALIASES]: (concept, tracker) => applyAliases(concept, tracker),
    [CONCEPT.FIELD.AUTHOR]: (concept, tracker) => applyAuthor(concept, tracker),
    [CONCEPT.FIELD.CHILDREN]: (concept, tracker) => applyChildren(concept, tracker),
    [CONCEPT.FIELD.MEDIA]: (concept, tracker) => applyMedia(concept, tracker),
    [CONCEPT.FIELD.PARENT]: (concept, tracker) => applyParent(concept, tracker),
    [CONCEPT.FIELD.RANK]: (concept, tracker) => applyRank(concept, tracker),
    [CONCEPT.FIELD.REALIZATIONS]: (concept, tracker) => applyRealizations(concept, tracker),
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
