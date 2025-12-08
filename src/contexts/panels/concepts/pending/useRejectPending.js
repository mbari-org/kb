import { use, useCallback } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { getConcept } from '@/lib/kb/api/concept'

import { HISTORY_FIELD } from '@/constants/historyField.js'
import { createError } from '@/lib/errors'

import rejectAlias from '@/contexts/panels/concepts/pending/reject/rejectAlias'
import rejectChild from '@/contexts/panels/concepts/pending/reject/rejectChild'
import rejectMedia from '@/contexts/panels/concepts/pending/reject/rejectMedia'
import rejectRank from '@/contexts/panels/concepts/pending/reject/rejectRank'
import rejectRealization from '@/contexts/panels/concepts/pending/reject/rejectRealization'
import rejectValue from '@/contexts/panels/concepts/pending/reject/rejectValue'

const useRejectPending = () => {
  const { concept: staleConcept } = use(ConceptContext)
  const { apiFns } = use(ConfigContext)

  return useCallback(
    async rejectingItems => {
      const freshConcept = await apiFns.apiPayload(getConcept, staleConcept.name)

      freshConcept.aliases = staleConcept.aliases.map(alias => ({ ...alias }))
      freshConcept.alternateNames = [...staleConcept.alternateNames]
      freshConcept.children = [...staleConcept.children]
      freshConcept.parent = staleConcept.parent
      freshConcept.rankLevel = staleConcept.rankLevel
      freshConcept.rankName = staleConcept.rankName
      freshConcept.media = staleConcept.media.map(media => ({ ...media }))
      freshConcept.realizations = staleConcept.realizations.map(realization => ({
        ...realization,
      }))

      rejectingItems.forEach(pendingItem => {
        let rejectFn

        switch (pendingItem.field) {
          case HISTORY_FIELD.ALIAS:
            rejectFn = rejectAlias
            break

          case HISTORY_FIELD.CHILD:
            rejectFn = rejectChild
            break

          case HISTORY_FIELD.MEDIA:
            rejectFn = rejectMedia
            break

          case HISTORY_FIELD.NAME:
            rejectFn = rejectValue
            break

          case HISTORY_FIELD.PARENT:
            rejectFn = rejectValue
            break

          case HISTORY_FIELD.RANK:
            rejectFn = rejectRank
            break

          case HISTORY_FIELD.REALIZATION:
            rejectFn = rejectRealization
            break

          default:
            throw createError(
              'Invalid Pending Field',
              `Cannot reject pending change with invalid field: ${pendingItem.field}`,
              { pendingItem }
            )
        }

        rejectFn(freshConcept, pendingItem, rejectingItems)
      })

      return freshConcept
    },
    [apiFns, staleConcept]
  )
}

export default useRejectPending
