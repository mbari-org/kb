import { use, useMemo } from 'react'

import ConceptStagedContext from '@/contexts/panels/concepts/ConceptStagedContext'
import ConceptModalDataContext from '@/contexts/panels/concepts/modal/ConceptModalDataContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import { binSearch } from '@/lib/utils'

import CONFIG from '@/lib/config'

const CHANGE_NAME = CONFIG.PANELS.CONCEPTS.MODALS.STRUCTURE.CHANGE_NAME

const useConceptNameValidate = (formData, modifiedFields) => {
  const { stagedState } = use(ConceptStagedContext)
  const { modalData } = use(ConceptModalDataContext)
  const { getNames } = use(TaxonomyContext)

  const editingAliasIndex = modalData?.action === CONCEPT_STATE.ALIAS.EDIT ? modalData.aliasIndex : null

  const stagedNames = useMemo(
    () =>
      new Set([
        ...(stagedState.name?.value ? [stagedState.name.value.toLowerCase()] : []),
        ...stagedState.children.map(child => child.name.toLowerCase()),
        ...stagedState.aliases.filter((_, index) => index !== editingAliasIndex).map(alias => alias.name.toLowerCase()),
      ]),
    [stagedState.name, stagedState.children, stagedState.aliases, editingAliasIndex]
  )

  const name = (formData.name || formData.value || '').trim().toLowerCase()

  const isValidName = name !== '' && !binSearch(getNames(), name, true) && !stagedNames.has(name)

  const nameHelperText = !modifiedFields.name
    ? ''
    : name === ''
      ? CHANGE_NAME.NAME_HELPER_TEXT
      : !isValidName
        ? CHANGE_NAME.NAME_EXISTS
        : ''

  return {
    isValidName,
    nameHelperText,
  }
}

export default useConceptNameValidate
