import { use, useCallback } from 'react'

import PropertyAddIcon from '@/components/common/icon/property/PropertyAddIcon'
import PropertyEditIcon from '@/components/common/icon/property/PropertyEditIcon'

import createEditAliasModal from '@/components/kb/panels/concepts/concept/change/staged/concept/aliases/edit/createEditAliasModal'
import createEditAliasOnClose from '@/components/kb/panels/concepts/concept/change/staged/concept/aliases/edit/createEditAliasOnClose'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { EMPTY_ALIAS, aliasFields } from '@/lib/kb/model/alias'

import { CONCEPT_STATE } from '@/lib/constants'

const EDIT = CONCEPT_STATE.ALIAS.EDIT

const AliasEditIcon = ({ action, aliasIndex, size }) => {
  const { initialState, modifyConcept, stagedState } = use(ConceptContext)
  const { setModal, setModalData } = use(ConceptModalContext)

  const onClick = useCallback(() => {
    const stagedAliasItem = stagedState.aliases[aliasIndex]
    const alias = stagedAliasItem ? aliasFields(stagedAliasItem) : EMPTY_ALIAS

    const actionModalData = {
      action,
      alias,
      aliasIndex,
      modified: { author: false, name: false, nameType: false },
    }
    setModalData(actionModalData)

    const modal = createEditAliasModal(action)
    const onClose = createEditAliasOnClose({ initialState, modifyConcept })

    setModal(modal, onClose)
  }, [action, aliasIndex, initialState, modifyConcept, setModal, setModalData, stagedState])

  const IconComponent = action === EDIT ? PropertyEditIcon : PropertyAddIcon

  return <IconComponent onClick={onClick} size={size} />
}

export default AliasEditIcon
