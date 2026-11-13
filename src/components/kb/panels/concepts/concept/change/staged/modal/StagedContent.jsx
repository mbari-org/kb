import { use, useEffect, useMemo } from 'react'

import { Box, Stack } from '@mui/material'

import ModalActionText from '@/components/common/ModalActionText'

import StagedAlias from '@/components/kb/panels/concepts/concept/change/staged/aliases/StagedAlias'
import StagedChild from '@/components/kb/panels/concepts/concept/change/staged/children/StagedChild'
import StagedMediaItem from '@/components/kb/panels/concepts/concept/change/staged/media/StagedMediaItem'
import StagedRealization from '@/components/kb/panels/concepts/concept/change/staged/realizations/StagedRealization'

import StagedObject from '@/components/kb/panels/concepts/concept/change/staged/StagedObject'
import StagedValue from '@/components/kb/panels/concepts/concept/change/staged/StagedValue'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptStagedContext from '@/contexts/panels/concepts/ConceptStagedContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { stateUpdates } from '@/contexts/panels/concepts/staged/edit/stateUpdates'
import { stagedAliasesEdits } from '@/lib/concept/state/aliases'
import { stagedChildren } from '@/lib/concept/state/children'
import { stagedMediaEdits } from '@/lib/concept/state/media'
import { stagedRealizationEdits } from '@/lib/concept/state/realizations'
import { isStateModified } from '@/lib/concept/state/state'

import { resettingItem } from '@/components/kb/panels/concepts/concept/change/staged/reset'

import CONFIG from '@/lib/config'
import { CONCEPT } from '@/lib/constants'

const { ITEM, STAGED } = CONFIG.PANELS.CONCEPTS.MODALS

const ARRAY_FIELDS = [
  [CONCEPT.FIELD.ALIASES, stagedAliasesEdits],
  [CONCEPT.FIELD.CHILDREN, stagedChildren],
  [CONCEPT.FIELD.MEDIA, stagedMediaEdits],
  [CONCEPT.FIELD.REALIZATIONS, stagedRealizationEdits],
]

const VALUE_FIELDS = [CONCEPT.FIELD.NAME, CONCEPT.FIELD.AUTHOR, CONCEPT.FIELD.PARENT, CONCEPT.FIELD.RANK]

const FIELD_LABEL = {
  [CONCEPT.FIELD.AUTHOR]: ITEM.AUTHOR,
  [CONCEPT.FIELD.NAME]: ITEM.NAME,
  [CONCEPT.FIELD.PARENT]: ITEM.PARENT,
  [CONCEPT.FIELD.RANK]: ITEM.RANK,
}

const StagedContent = () => {
  const { initialState } = use(ConceptContext)
  const { confirmReset, stagedState } = use(ConceptStagedContext)
  const { closeModal } = use(ConceptModalContext)

  const updates = useMemo(
    () => stateUpdates(initialState, stagedState),
    [initialState, stagedState]
  )

  const stagedItems = useMemo(() => {
    const arrayItems = ARRAY_FIELDS.flatMap(([field, editsFn]) =>
      updates[field]
        ? editsFn([field, updates[field]]).map(edit => ({
            edit,
            field,
            initialItem: updates[field].initial?.[edit.index],
            key: `${field}-${edit.stateId ?? edit.index}`,
            seq: edit.stagedSeq,
          }))
        : []
    )

    const valueItems = VALUE_FIELDS.filter(field => updates[field]).map(field => ({
      field,
      key: field,
      seq: updates[field].staged.stagedSeq,
      stagedEdit: [field, updates[field]],
    }))

    return [...arrayItems, ...valueItems].sort((a, b) => a.seq - b.seq)
  }, [updates])

  const stagedComponent = item => {
    switch (item.field) {
      case CONCEPT.FIELD.ALIASES:
        return (
          <StagedAlias
            key={item.key}
            initialItem={item.initialItem}
            resetting={resettingItem(confirmReset, item.field, item.edit.index)}
            stagedItem={item.edit}
          />
        )

      case CONCEPT.FIELD.CHILDREN:
        return (
          <StagedChild
            key={item.key}
            initialItem={item.initialItem}
            resetting={resettingItem(confirmReset, item.field, item.edit.index)}
            stagedItem={item.edit}
          />
        )

      case CONCEPT.FIELD.MEDIA:
        return (
          <StagedMediaItem
            key={item.key}
            initialItem={item.initialItem}
            resetting={resettingItem(confirmReset, item.field, item.edit.index)}
            stagedItem={item.edit}
          />
        )

      case CONCEPT.FIELD.REALIZATIONS:
        return (
          <StagedRealization
            key={item.key}
            initialItem={item.initialItem}
            resetting={resettingItem(confirmReset, item.field, item.edit.index)}
            stagedItem={item.edit}
          />
        )

      case CONCEPT.FIELD.NAME:
      case CONCEPT.FIELD.RANK:
        return (
          <StagedObject
            key={item.key}
            field={item.field}
            label={FIELD_LABEL[item.field]}
            stagedEdit={item.stagedEdit}
          />
        )

      case CONCEPT.FIELD.AUTHOR:
      case CONCEPT.FIELD.PARENT:
        return (
          <StagedValue
            key={item.key}
            field={item.field}
            label={FIELD_LABEL[item.field]}
            stagedEdit={item.stagedEdit}
          />
        )

      default:
        return null
    }
  }

  useEffect(() => {
    if (!isStateModified({ initialState, stagedState })) {
      closeModal(true)
    }
  }, [closeModal, initialState, stagedState])

  return (
    <Stack direction='column' spacing={1}>
      <ModalActionText text={STAGED.DESCRIPTION} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxHeight: '60vh', overflowY: 'auto', pr: 1 }}>{stagedItems.map(stagedComponent)}</Box>
    </Stack>
  )
}

export default StagedContent
