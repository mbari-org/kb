import { IconButton, Menu, MenuItem } from '@mui/material'
import { useState, useRef } from 'react'

const HistoryNavButton = ({ dropItems, icon: Icon, label, onClick, onItemSelect, ...props }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const pressTimer = useRef(null)
  const wasLongPress = useRef(false)

  const handlePressStart = event => {
    event.preventDefault()
    wasLongPress.current = false
    const target = event.currentTarget
    pressTimer.current = setTimeout(() => {
      wasLongPress.current = true
      setAnchorEl(target)
    }, 333)
  }

  const handlePressEnd = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current)
      pressTimer.current = null
    }
  }

  const handleClick = event => {
    if (wasLongPress.current) {
      event.preventDefault()
      event.stopPropagation()
      return
    }
    onClick?.(event)
  }

  const handleClose = () => {
    setAnchorEl(null)
    wasLongPress.current = false
  }

  const handleItemClick = index => {
    onItemSelect?.(index)
    handleClose()
  }

  return (
    <>
      <IconButton
        color='inherit'
        aria-label={label}
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
        onClick={handleClick}
        sx={{
          '& svg': {
            fontSize: '1.1rem',
          },
        }}
        {...props}
      >
        <Icon />
      </IconButton>
      {dropItems?.length > 0 && (
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          PaperProps={{
            sx: {
              mt: 1,
              maxHeight: 300,
              width: 200,
              '& .MuiMenuItem-root': {
                fontSize: '0.875rem',
                px: 2,
                py: 1,
              },
            },
          }}
          MenuListProps={{
            sx: {
              py: 0,
            },
          }}
        >
          {dropItems.map((item, index) => (
            <MenuItem key={index} onClick={() => handleItemClick(index)}>
              {item}
            </MenuItem>
          ))}
        </Menu>
      )}
    </>
  )
}

export default HistoryNavButton
