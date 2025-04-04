import { use, useMemo } from 'react'

import { createActions } from '@/components/modal/factory'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/conceptState'

import LABELS from '@/components/kb/panels/concepts/stagedState/labels'

import { ADD_CHILD_FORM_ID } from './AddChildContent'

const { CONFIRM_DISCARD, CONTINUE, DISCARD, STAGE } = LABELS.ACTION
const { CONFIRMED } = CONCEPT_STATE.RESET

const AddChildActions = () => {
  const { confirmReset, modifyConcept, stagedState } = use(ConceptContext)
  const { closeModal, modalData } = use(ModalContext)
  const { getNames } = use(TaxonomyContext)

  const { child, modified } = modalData

  const isValidChild = useMemo(() => {
    if (child.name === '') {
      return false
    }
    return (
      !getNames().includes(child.name) &&
      !stagedState.children.some(stagedChild => stagedChild.name === child.name)
    )
  }, [child, getNames, stagedState.children])

  const colors = ['cancel', 'main']
  const disabled = [false, !confirmReset && (!modified || !isValidChild)]
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
        document.querySelector(`#${ADD_CHILD_FORM_ID}`)?.requestSubmit()
        break
    }
  }

  return createActions({ colors, disabled, labels, onAction }, 'ConceptNameUpdateActions')
}

export default AddChildActions
