import { use, useState } from 'react'
import { useTheme } from '@emotion/react'

import { Button } from '@mui/material'

import UserContext from '@/contexts/user/UserContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import useDisplayStaged from '@/components/kb/panels/concepts/concept/change/staged/modal/useDisplayStaged'

import { LABELS, SELECTED } from '@/lib/constants'

const { CONTINUE } = LABELS.BUTTON

const PanelLink = ({ isActive, name, selectPanel }) => {
  const { panels } = use(SelectedContext)
  const { hasUnsavedChanges } = use(UserContext)
  const { setModalData } = use(ConceptModalContext)

  const displayStaged = useDisplayStaged()

  const currentPanel = panels.current()

  const [isHovering, setIsHovering] = useState(false)

  const theme = useTheme()
  const getSx = () => {
    const activeColor = theme.selector.active
    const hoverColor = theme.selector.hover
    const inactiveColor = theme.selector.inactive

    const color = isActive ? activeColor : isHovering ? hoverColor : inactiveColor

    return {
      color: color,
      fontSize: '0.875rem',
      fontStyle: !isActive && isHovering ? 'italic' : '',
      marginLeft: theme.spacing(0.5),
      marginBottom: 1.5,
    }
  }

  const handleClick = () => {
    if (name === currentPanel) return

    // Check if we're switching away from Concepts panel with unsaved changes
    const isOnConceptsPanel = currentPanel === SELECTED.PANELS.CONCEPTS
    const hasModifications = isOnConceptsPanel && hasUnsavedChanges

    if (hasModifications) {
      displayStaged(CONTINUE)
      setModalData(prev => ({ ...prev, panel: name }))
    } else {
      selectPanel(name)
    }
  }

  return (
    <Button
      onClick={handleClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      sx={getSx()}
    >
      {name}
    </Button>
  )
}

export default PanelLink
