import { use, useMemo } from 'react'

import { createActions } from '@/components/modal/factory'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { ADD_ALIAS_FORM_ID } from './EditAliasContent'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/conceptState'
import LABELS from '@/components/kb/panels/concepts/stagedState/labels'

const { CONFIRM_DISCARD, CONTINUE, DISCARD, STAGE } = LABELS.ACTION
const { CONFIRMED } = CONCEPT_STATE.RESET

const EditAliasActions = () => {
  const { confirmReset, modifyConcept } = use(ConceptContext)
  const { closeModal, modalData } = use(ModalContext)
  const { getNames } = use(TaxonomyContext)

  const { alias, modified } = modalData

  const isValidAlias = useMemo(() => {
    if (alias.name === '' || alias.author === '') {
      return false
    }
    return !getNames().includes(alias.name)
  }, [alias, getNames])

  const colors = ['cancel', 'main']
  const disabled = [false, !modified || !isValidAlias]
  const labels = confirmReset ? [CONFIRM_DISCARD, CONTINUE] : [DISCARD, STAGE]

  const onAction = label => {
    switch (label) {
      case CONTINUE:
        modifyConcept({ type: CONFIRMED.NO })
        break

      case CONFIRM_DISCARD:
        modifyConcept({ type: CONFIRMED.YES })
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
