import { use, useMemo } from 'react'

import AppModalContext from './AppModalContext'
import PanelModalContext from './PanelModalContext'

const PanelModalProvider = ({ children }) => {
  const appModalValue = use(AppModalContext)

  // This provider acts as a bridge, providing the same modal functionality
  // but also ensuring modal content has access to panel-specific contexts
  const value = useMemo(
    () => ({
      ...appModalValue,
      // We can add panel-specific modal functionality here if needed
    }),
    [appModalValue]
  )

  return <PanelModalContext.Provider value={value}>{children}</PanelModalContext.Provider>
}

export default PanelModalProvider
