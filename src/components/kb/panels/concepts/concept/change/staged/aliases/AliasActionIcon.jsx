import { use, useCallback } from 'react'

import PropertyAddIcon from '@/components/icon/property/PropertyAddIcon'
import PropertyDeleteIcon from '@/components/icon/property/PropertyDeleteIcon'
import PropertyEditIcon from '@/components/icon/property/PropertyEditIcon'

import createAliasModal from '@/components/kb/panels/concepts/concept/change/staged/aliases/createAliasModal'
import createAliasOnClose from '@/components/kb/panels/concepts/concept/change/staged/aliases/createAliasOnClose'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { aliasFields, EMPTY_ALIAS } from '@/lib/kb/model/aliases'

import { CONCEPT_STATE } from '@/lib/kb/constants/conceptState.js'

const ADD = CONCEPT_STATE.ALIAS.ADD
const DELETE = CONCEPT_STATE.ALIAS.DELETE

const AliasActionIcon = ({ action, aliasIndex, size }) => {
  const { initialState, modifyConcept, stagedState } = use(ConceptContext)
  const { setModal, setModalData } = use(ConceptModalContext)

  const tooltip = action === ADD ? 'Add Alias' : action === DELETE ? 'Delete Alias' : 'Edit Alias'

  const onClick = useCallback(() => {
    const aliasItem = action === ADD ? EMPTY_ALIAS : aliasFields(stagedState.aliases[aliasIndex])

    const actionModalData = {
      action,
      aliasItem,
      aliasIndex,
      modified: { author: false, name: false, nameType: false },
    }
    setModalData(actionModalData)

    const modal = createAliasModal(action)
    const onClose = createAliasOnClose({ initialState, modifyConcept })

    setModal(modal, onClose)
  }, [action, aliasIndex, initialState, modifyConcept, setModal, setModalData, stagedState])

  const IconComponent =
    action === ADD ? PropertyAddIcon : action === DELETE ? PropertyDeleteIcon : PropertyEditIcon

  return <IconComponent onClick={onClick} size={size} tooltip={tooltip} />
}

export default AliasActionIcon
