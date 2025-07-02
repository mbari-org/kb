import { use } from 'react'

import { createActions } from '@/components/modal/panelModalFactory'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { ADD_ALIAS_FORM_ID } from './EditAliasContent'

import { CONCEPT_STATE } from '@/lib/constants'

import { LABELS } from '@/lib/constants'

const { CONFIRM_DISCARD, CONTINUE, DISCARD, STAGE } = LABELS.BUTTON
const { CONFIRMED } = CONCEPT_STATE.RESET

const EditAliasActions = () => {
  const { confirmReset, modifyConcept } = use(ConceptContext)
  const { closeModal, modalData } = use(ConceptModalContext)
  const { getNames } = use(TaxonomyContext)

  const { alias, modified } = modalData

  const isModified = Object.values(modified).some(isModified => isModified === true)

  const validName = !modified.name || (alias.name !== '' && !getNames().includes(alias.name))

  const colors = ['cancel', 'main']
  const disabled = [false, !isModified || !validName]
  const labels = confirmReset ? [CONFIRM_DISCARD, CONTINUE] : [DISCARD, STAGE]

  const onAction = label => {
    switch (label) {
      case CONFIRM_DISCARD:
        modifyConcept({ type: CONFIRMED.YES })
        closeModal(true)
        break

      case CONTINUE:
        modifyConcept({ type: CONFIRMED.NO })
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
