import { use, useState } from 'react'

import ModalContext from '@/contexts/modal/ModalContext'

import { checkUrlExists, isValidUrl } from '@/lib/util'

const useHandleMediaChange = setData => {
  const { data } = use(ModalContext)

  const [urlStatus, setUrlStatus] = useState({ loading: false, valid: true })
  const [urlCheckTimeout, setUrlCheckTimeout] = useState(null)

  const handleChange = e => {
    const { name, value, type, checked } = e.target

    const dataEditing = {
      ...data.editing,
      [name]: type === 'checkbox' ? checked : value,
    }

    const isDirty = Object.keys(dataEditing).some(key => dataEditing[key] !== data.initial[key])

    setData(prev => ({
      ...prev,
      dirty: isDirty,
      editing: dataEditing,
      touched: {
        ...prev.touched,
        [name]: true,
      },
    }))

    // Debounced URL check
    if (name === 'url' && isValidUrl(value)) {
      // Clear any existing timeout
      if (urlCheckTimeout) {
        clearTimeout(urlCheckTimeout)
      }

      // Set loading state immediately
      setUrlStatus({ loading: true, valid: true })

      // Create new timeout for URL check
      const timeoutId = setTimeout(() => {
        checkUrlExists(value).then(exists => {
          setUrlStatus({ loading: false, valid: exists })
        })
      }, 500) // 1 second delay

      setUrlCheckTimeout(timeoutId)
    }
  }

  return {
    handleChange,
    urlStatus,
    setUrlStatus,
    urlCheckTimeout,
    setUrlCheckTimeout,
  }
}

export default useHandleMediaChange
