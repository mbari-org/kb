import { use, useMemo } from 'react'

import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

const useAliasValidate = (formAlias) => {
  const { modalData } = use(ConceptModalContext)
  const { getNames } = use(TaxonomyContext)

  const isValidName = useMemo(() => {
    return !getNames().includes(formAlias.name)
  }, [formAlias.name, getNames])

  const nameError = modalData.modified.name && !isValidName

  const nameHelperText = !modalData.modified.name
    ? ''
    : formAlias.name.trim() === ''
    ? 'Name cannot be empty'
    : !isValidName
    ? 'Concept name already exists'
    : ''

  return {
    nameError,
    nameHelperText,
  }
}

export default useAliasValidate
