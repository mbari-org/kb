import { use, useMemo } from 'react'

import ConceptModalContext from '@/contexts/modal/concept/ConceptModalContext'
import PanelModalContext from '@/contexts/modal/panel/PanelModalContext'

const PanelModalProvider = ({ children }) => {
  const conceptModalValue = use(ConceptModalContext)

  // This provider acts as a bridge, providing the same modal functionality
  // but also ensuring modal content has access to panel-specific contexts
  const value = useMemo(
    () => ({
      ...conceptModalValue,
      // We can add panel-specific modal functionality here if needed
    }),
    [conceptModalValue]
  )

  return <PanelModalContext value={value}>{children}</PanelModalContext>
}

export default PanelModalProvider
