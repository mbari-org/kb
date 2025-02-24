import { useTheme } from '@emotion/react'
import { useState } from 'react'

import { Button } from '@mui/material'

const PanelLink = ({ isActive, name, selectPanel }) => {
  const [isHovering, setIsHovering] = useState(false)

  const theme = useTheme()
  const getSx = () => {
    const activeColor = theme.nav.active
    const hoverColor = theme.nav.hover
    const inactiveColor = theme.nav.inactive

    const color = isActive ? activeColor : isHovering ? hoverColor : inactiveColor

    return {
      color: color,
      fontSize: '0.875rem',
      fontStyle: !isActive && isHovering ? 'italic' : '',
      marginLeft: theme.spacing(0.5),
      marginBottom: 1.5,
    }
  }

  return (
    <Button
      onClick={() => selectPanel(name)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      sx={getSx()}
    >
      {name}
    </Button>
  )
}

export default PanelLink
