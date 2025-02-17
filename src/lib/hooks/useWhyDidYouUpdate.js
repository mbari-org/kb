import { useEffect, useRef } from 'react'

import { isDeepEqual } from '@/lib/util'

const useWhyDidYouUpdate = (name, props) => {
  const previousProps = useRef()

  useEffect(() => {
    if (previousProps.current) {
      const allKeys = Object.keys({ ...previousProps.current, ...props })
      const changes = {}
      allKeys.forEach(key => {
        if (!isDeepEqual(previousProps.current[key], props[key])) {
          changes[key] = {
            b4: previousProps.current[key],
            to: props[key],
          }
        }
      })

      if (Object.keys(changes).length) {
        console.log('[why-did-you-update]', name, changes)
      }
    }

    previousProps.current = props
  })
}

export default useWhyDidYouUpdate
