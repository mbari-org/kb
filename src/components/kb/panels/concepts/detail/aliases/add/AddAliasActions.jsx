import { use, useMemo } from 'react'

import { createActions } from '@/components/modal/factory'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { ADD_ALIAS_FORM_ID } from './AddAliasContent'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/conceptState'

const CONFIRM_DISCARD = 'Confirm Discard'
const CONTINUE = 'Continue'
const DISCARD = 'Discard'
const STAGE = 'Stage'

const AddAliasActions = () => {
  const { confirmReset, modifyConcept } = use(ConceptContext)
  const { closeModal, modalData } = use(ModalContext)
  const { getNames } = use(TaxonomyContext)
  const { alias, modified } = modalData

  const isValidName = useMemo(() => {
    const names = getNames()
    return !names.includes(alias.name)
  }, [alias.name, getNames])

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

export default AddAliasActions
