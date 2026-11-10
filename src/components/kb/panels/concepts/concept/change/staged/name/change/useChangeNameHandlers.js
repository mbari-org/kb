import { use, useEffect } from 'react'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import UserContext from '@/contexts/user/UserContext'

import CONFIG from '@/lib/config'

const { REASSIGN } = CONFIG.CONCEPT.CHANGE_NAME

const useChangeNameHandlers = (name, setName, nameError, setModifiedFields) => {
  const { concept } = use(ConceptContext)
  const { setModalData } = use(ConceptModalContext)
  const { isAdmin } = use(UserContext)

  const isValidModified = updatedName => {
    const { extent, value } = updatedName

    const isNameModified = value !== concept.name
    // Use the validation hook result instead of custom logic
    const isNameValid = isNameModified && !nameError
    if (isAdmin) {
      return {
        isValid: isNameValid && extent !== '',
        modified: isNameValid || extent !== '',
      }
    } else {
      return {
        isValid: isNameValid,
        modified: isNameModified,
      }
    }
  }

  const handleNameChange = event => {
    const updatedName = {
      ...name,
      value: event.target.value,
    }
    setName(prevName => ({ ...prevName, value: event.target.value }))

    // Only mark as modified if the value is actually different from the original
    const isActuallyModified = updatedName.value !== concept.name
    setModifiedFields({ name: isActuallyModified })

    const { isValid, modified } = isValidModified(updatedName)
    setModalData(prevData => ({
      ...prevData,
      isValid,
      modified,
      name: updatedName,
    }))
  }

  const handleNameExtentChange = event => {
    const updatedExtent = event.target.value
    setName(prevName => ({ ...prevName, extent: updatedExtent }))

    const { isValid, modified } = isValidModified({ ...name, extent: updatedExtent })
    setModalData(prevData => ({
      ...prevData,
      isValid,
      modified,
      name: { ...prevData.name, extent: updatedExtent },
    }))
  }

  useEffect(() => {
    setModalData({
      isValid: false,
      modified: false,
      name: { value: concept.name, extent: isAdmin ? REASSIGN : '' },
    })
  }, [concept, isAdmin, setModalData])

  return {
    handleNameChange,
    handleNameExtentChange,
  }
}

export default useChangeNameHandlers
