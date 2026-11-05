import { use, useCallback } from 'react'
import { Stack } from '@mui/material'

import RankFieldInput from '@/components/kb/panels/concepts/concept/change/staged/rank/RankFieldInput'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptStagedContext from '@/contexts/panels/concepts/ConceptStagedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { pendingChange, rankField } from '@/lib/concept/state/rank'
import CONFIG from '@/lib/config'
import { PENDING } from '@/lib/constants/pending.js'
import { CONCEPT } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

const ConceptRank = () => {
  const { initialState, isEditing, pending } = use(ConceptContext)
  const { modifyConcept, stagedState } = use(ConceptStagedContext)
  const { filterRanks } = use(TaxonomyContext)

  const initialRank = initialState.rank
  const stagedRank = stagedState.rank

  const applyRankUpdate = update => {
    const updatedRank = { ...stagedRank, ...update }
    const action =
      updatedRank.name === initialRank.name && updatedRank.level === initialRank.level
        ? CONCEPT_STATE.NO_ACTION
        : CONCEPT_STATE.RANK
    modifyConcept({
      type: CONCEPT_STATE.RANK,
      update: {
        action,
        ...update,
      },
    })
  }

  const onChange = field => event => {
    const value = event.target.value
    if (field === CONCEPT.RANK.NAME) {
      const level = stagedRank.level
      if (level && !filterRanks(rankField(CONCEPT.RANK.LEVEL), value).includes(level)) {
        applyRankUpdate({ level: '', name: value })
        return
      }
    }
    applyRankUpdate({ [field]: value })
  }

  const onClear = field => () => {
    applyRankUpdate(field === CONCEPT.RANK.NAME ? { level: '', name: '' } : { level: '' })
  }

  const stagedField = useCallback(
    field => {
      const pendingConcept = pending(PENDING.DATA.CONCEPT)
      const pendingRankChange = pendingChange(pendingConcept)

      if (pendingRankChange) {
        if (pendingRankChange.new[field] === pendingRankChange.old[field]) {
          return {
            ...stagedRank,
            action: CONCEPT_STATE.NO_ACTION,
            historyId: undefined,
          }
        }
        return stagedRank
      }

      if (stagedRank[field] === initialRank[field]) {
        return {
          ...stagedRank,
          action: CONCEPT_STATE.NO_ACTION,
        }
      }

      return stagedRank
    },
    [initialRank, pending, stagedRank]
  )

  return (
    <Stack direction='row' spacing={1.5}>
      <RankFieldInput
        field={CONCEPT.RANK.NAME}
        initialRank={initialRank}
        label={CONFIG.PANELS.CONCEPTS.RANK.NAME}
        rank={stagedField(CONCEPT.RANK.NAME)}
        onChange={onChange(CONCEPT.RANK.NAME)}
        onClear={isEditing ? onClear(CONCEPT.RANK.NAME) : undefined}
      />
      <RankFieldInput
        field={CONCEPT.RANK.LEVEL}
        initialRank={initialRank}
        label={CONFIG.PANELS.CONCEPTS.RANK.LEVEL}
        rank={stagedField(CONCEPT.RANK.LEVEL)}
        onChange={onChange(CONCEPT.RANK.LEVEL)}
        onClear={isEditing ? onClear(CONCEPT.RANK.LEVEL) : undefined}
      />
    </Stack>
  )
}

export default ConceptRank
