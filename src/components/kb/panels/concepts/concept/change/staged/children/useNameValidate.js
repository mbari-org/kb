import { use, useMemo } from 'react'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

const useNameValidate = (formChild, modifiedFields) => {
  const { stagedState } = use(ConceptContext)
  const { getNames } = use(TaxonomyContext)

  const isValidName = useMemo(() => {
    return !getNames().includes(formChild?.name)
  }, [formChild?.name, getNames])

  const isValidAddition = useMemo(() => {
    return !stagedState.children.some(stagedChild => stagedChild.name === formChild.name)
  }, [formChild?.name, stagedState.children])

  const nameError =
    modifiedFields.name && (formChild.name.trim() === '' || !isValidName || !isValidAddition)

  const nameHelperText = !modifiedFields.name
    ? ''
    : formChild.name.trim() === ''
    ? 'Name cannot be empty'
    : !isValidName
    ? 'Concept name already exists'
    : !isValidAddition
    ? 'Child already being added'
    : ''

  return {
    nameError,
    nameHelperText,
  }
}

export default useNameValidate
