import { use, useCallback } from 'react'

import PropertyAddIcon from '@/components/common/icon/property/PropertyAddIcon'
import PropertyDeleteIcon from '@/components/common/icon/property/PropertyDeleteIcon'
import PropertyEditIcon from '@/components/common/icon/property/PropertyEditIcon'

import createAliasModal from '@/components/kb/panels/concepts/concept/change/staged/aliases/createAliasModal'
import createAliasOnClose from '@/components/kb/panels/concepts/concept/change/staged/aliases/createAliasOnClose'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { aliasFields, EMPTY_ALIAS } from '@/lib/kb/model/alias'

import { CONCEPT_STATE } from '@/lib/constants'

const ADD = CONCEPT_STATE.ALIAS_ITEM.ADD
const DELETE = CONCEPT_STATE.ALIAS_ITEM.DELETE

const AliasModifyIcon = ({ action, aliasIndex, size }) => {
  const { initialState, modifyConcept, stagedState } = use(ConceptContext)
  const { setModal, setModalData } = use(ConceptModalContext)

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

  return <IconComponent onClick={onClick} size={size} />
}

export default AliasModifyIcon
