import { use, useEffect, useState } from 'react'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import UserContext from '@/contexts/user/UserContext'

import { isAdmin } from '@/lib/auth/role'

const useChangeNameHandlers = (name, setName, nameError, setModifiedFields) => {
  const { concept } = use(ConceptContext)
  const { setModalData } = use(ConceptModalContext)
  const { user } = use(UserContext)

  const isAdminUser = isAdmin(user)

  const isValidModified = updatedName => {
    const { extent, value } = updatedName

    const isNameModified = value !== concept.name
    // Use the validation hook result instead of custom logic
    const isNameValid = isNameModified && !nameError
    if (isAdminUser) {
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
      extent: '',
      value: event.target.value,
    }
    setName(prevName => ({ ...prevName, ...updatedName }))
    
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
      name: { value: concept.name, extent: '' },
    })
  }, [concept, setModalData])

  return {
    handleNameChange,
    handleNameExtentChange,
  }
}

export default useChangeNameHandlers
