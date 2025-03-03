import { useEffect, useRef } from 'react'

import { isDeepEqual } from '@/lib/util'

const useUpdateTrigger = (name, props) => {
  const prevProps = useRef()

  useEffect(() => {
    if (prevProps.current) {
      const allKeys = Object.keys({ ...prevProps.current, ...props })
      const changes = {}
      allKeys.forEach(key => {
        if (!isDeepEqual(prevProps.current[key], props[key])) {
          changes[key] = {
            b4: prevProps.current[key],
            to: props[key],
          }
        }
      })

      if (Object.keys(changes).length) {
        console.log('[update-trigger]', name, changes)
      }
    }

    prevProps.current = props
  })
}

export default useUpdateTrigger
