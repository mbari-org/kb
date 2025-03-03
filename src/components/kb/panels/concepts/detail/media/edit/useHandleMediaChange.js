import { useEffect, useState } from 'react'

import { checkImageUrlExists, isValidUrl } from '@/lib/util'

const useHandleMediaChange = (mediaItem, setMediaItem) => {
  // const { editingState, modifyConcept } = use(ConceptContext)

  // Checking the validity of the URL is delayed
  const [urlStatus, setUrlStatus] = useState({ loading: false, valid: true })
  const [urlCheckTimeout, setUrlCheckTimeout] = useState(null)

  const handleChange = event => {
    const { name, value, type, checked } = event.target

    const formMediaItem = {
      ...mediaItem,
      [name]: type === 'checkbox' ? checked : value,
    }

    setMediaItem(formMediaItem)

    // Delay URL validation check
    if (name === 'url' && isValidUrl(value)) {
      // Clear any existing timeout
      if (urlCheckTimeout) {
        clearTimeout(urlCheckTimeout)
      }

      // Set loading state immediately
      setUrlStatus({ loading: true, valid: true })

      // Create new timeout for URL check
      const timeoutId = setTimeout(() => {
        checkImageUrlExists(value).then(exists => {
          setUrlStatus({ loading: false, valid: exists })
        })
      }, 500)

      setUrlCheckTimeout(timeoutId)
    }

    return formMediaItem
  }

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (urlCheckTimeout) {
        clearTimeout(urlCheckTimeout)
      }
    }
  }, [urlCheckTimeout])

  return {
    handleChange,
    urlStatus,
  }
}

export default useHandleMediaChange
