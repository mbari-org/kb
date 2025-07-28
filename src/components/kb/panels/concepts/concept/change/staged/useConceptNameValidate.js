import { use, useMemo } from 'react'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { CONCEPT_STATE } from '@/lib/constants'

const useConceptNameValidate = (formData, modifiedFields) => {
  const { stagedState } = use(ConceptContext)
  const { modalData } = use(ConceptModalContext)
  const { getNames } = use(TaxonomyContext)

  const isValidName = useMemo(() => {
    // Handle both formData.name (for children/aliases) and formData.value (for concept name changes)
    const name = (formData.name || formData.value || '').trim()

    if (name === '' || getNames().includes(name)) return false

    const existingNames = [
      ...(stagedState.name?.value ? [stagedState.name.value] : []),
      ...stagedState.children.map(child => child.name),
      ...stagedState.aliases
        .filter((_, index) => {
          // For alias edit, exclude the current item being edited
          if (modalData?.action === CONCEPT_STATE.ALIAS.EDIT && index === modalData.aliasIndex) {
            return false
          }
          return true
        })
        .map(alias => alias.name),
    ]
    return !existingNames.includes(name)
  }, [
    formData.name,
    formData.value,
    getNames,
    stagedState.name,
    stagedState.children,
    stagedState.aliases,
    modalData,
  ])

  const nameError = modifiedFields.name && !isValidName

  const nameHelperText = !modifiedFields.name
    ? ''
    : (formData.name || formData.value || '').trim() === ''
    ? 'Name cannot be empty'
    : !isValidName
    ? 'Concept name already exists'
    : ''

  return {
    nameError,
    nameHelperText,
  }
}

export default useConceptNameValidate
