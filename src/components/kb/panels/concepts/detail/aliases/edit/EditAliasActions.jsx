import { use, useMemo } from 'react'

import { createActions } from '@/components/modal/factory'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { ADD_ALIAS_FORM_ID } from './EditAliasContent'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/conceptState'
import LABELS from '@/components/kb/panels/concepts/stagedState/labels'

const EditAliasActions = () => {
  const { confirmReset, modifyConcept, stagedState } = use(ConceptContext)
  const { closeModal, modalData } = use(ModalContext)
  const { taxonomyNames } = use(TaxonomyContext)

  const { alias, aliasIndex, modified } = modalData

  const stagedAlias = useMemo(
    () => ({ ...stagedState.aliases[aliasIndex] }),
    [stagedState.aliases, aliasIndex]
  )

  const isValidName = useMemo(() => {
    if (stagedAlias.name === modalData.alias.name) {
      return true
    }

    return !taxonomyNames.includes(alias.name)
  }, [alias.name, modalData.alias.name, taxonomyNames, stagedAlias.name])

  const { CONFIRM_DISCARD, CONTINUE, DISCARD, STAGE } = LABELS.ACTION

  const colors = ['cancel', 'main']
  const disabled = [false, !modified || !isValidName]
  const labels = confirmReset ? [CONFIRM_DISCARD, CONTINUE] : [DISCARD, STAGE]

  const onAction = label => {
    switch (label) {
      case CONTINUE:
        modifyConcept({ type: CONCEPT_STATE.RESET.CONFIRMED.NO })
        break

      case CONFIRM_DISCARD:
        modifyConcept({ type: CONCEPT_STATE.RESET.CONFIRMED.YES })
        closeModal(true)
        break

      case DISCARD:
        closeModal()
        break

      case STAGE:
        // Need to go through the form to trigger required and validation checks
        document.querySelector(`#${ADD_ALIAS_FORM_ID}`)?.requestSubmit()
        break
    }
  }

  return createActions({ colors, disabled, labels, onAction }, 'AddAliasActions')
}

export default EditAliasActions
