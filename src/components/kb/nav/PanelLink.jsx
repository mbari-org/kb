import { use, useState } from 'react'
import { useTheme } from '@emotion/react'

import { Button } from '@mui/material'

import SelectedContext from '@/contexts/selected/SelectedContext'
import useUnsafeAction from '@/contexts/user/useUnsafeAction'

const PanelLink = ({ isActive, name, selectPanel }) => {
  const { panels } = use(SelectedContext)
  const { guardPanelChange } = useUnsafeAction()

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
    guardPanelChange({ onSafe: () => selectPanel(name), panel: name })
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
