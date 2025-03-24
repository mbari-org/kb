import { useEffect, useRef } from 'react'

import { isRefEqual } from '@/lib/util'

const useUpdateTrigger = (name, props, depth = 2) => {
  const prevProps = useRef()

  useEffect(() => {
    if (prevProps.current) {
      const allKeys = Object.keys({ ...prevProps.current, ...props })
      const changes = {}
      allKeys.forEach(key => {
        if (
          prevProps.current[key] !== props[key] ||
          !isRefEqual(prevProps.current[key], props[key], depth)
        ) {
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
  }, [name, props, depth])
}

export default useUpdateTrigger
