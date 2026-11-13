import { use, useMemo } from 'react'

import ConceptStagedContext from '@/contexts/panels/concepts/ConceptStagedContext'
import ConceptModalDataContext from '@/contexts/panels/concepts/modal/ConceptModalDataContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { isPendingAdd } from '@/lib/model/history'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import { binSearch } from '@/lib/utils'

import CONFIG from '@/lib/config'

const CHANGE_NAME = CONFIG.PANELS.CONCEPTS.MODALS.STRUCTURE.CHANGE_NAME

const useConceptNameValidate = (formData, modifiedFields) => {
  const { stagedState } = use(ConceptStagedContext)
  const { modalData } = use(ConceptModalDataContext)
  const { pendingHistory } = use(PanelDataContext)
  const { getNames } = use(TaxonomyContext)

  const editingAliasIndex = modalData?.action === CONCEPT_STATE.ALIAS.EDIT ? modalData.aliasIndex : null

  const stagedNames = useMemo(
    () =>
      new Set([
        ...(stagedState.name?.value ? [stagedState.name.value.toLowerCase()] : []),
        ...stagedState.children.map(child => child.name.toLowerCase()),
        ...stagedState.aliases
          .filter((_, index) => index !== editingAliasIndex)
          .map(alias => alias.name.toLowerCase()),
      ]),
    [stagedState.name, stagedState.children, stagedState.aliases, editingAliasIndex]
  )

  const pendingAddNames = useMemo(
    () =>
      new Set(
        pendingHistory.filter(isPendingAdd).map(item => item.newValue.toLowerCase())
      ),
    [pendingHistory]
  )

  const name = (formData.name || formData.value || '').trim().toLowerCase()

  const existsInTaxonomy = name !== '' && binSearch(getNames(), name, true)
  const existsInStaged = stagedNames.has(name)
  const existsInPendingAdd = pendingAddNames.has(name)

  const isValidName = name !== '' && !existsInTaxonomy && !existsInStaged && !existsInPendingAdd

  const nameHelperText = !modifiedFields.name
    ? ''
    : name === ''
      ? CHANGE_NAME.NAME_HELPER_TEXT
      : existsInPendingAdd
        ? CHANGE_NAME.NAME_PENDING_ADD
        : !isValidName
          ? CHANGE_NAME.NAME_EXISTS
          : ''

  return {
    isValidName,
    nameHelperText,
  }
}

export default useConceptNameValidate
