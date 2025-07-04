import { useState, useRef, useEffect } from 'react'
import { IconButton, Menu, MenuItem } from '@mui/material'

const NavHistoryButton = ({ dropItems, icon: Icon, label, onClick, onItemSelect, ...props }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [hoveredIndex, setHoveredIndex] = useState(-1)
  const [isDragging, setIsDragging] = useState(false)
  const open = Boolean(anchorEl)
  const pressTimer = useRef(null)
  const wasLongPress = useRef(false)

  // Add document-level mouse event listeners
  useEffect(() => {
    const handleDocumentMouseUp = () => {
      if (isDragging) {
        // If we were dragging and have a hovered item, select it
        if (hoveredIndex >= 0) {
          onItemSelect?.(hoveredIndex)
        }
        handleClose()
      }
    }

    if (isDragging) {
      document.addEventListener('mouseup', handleDocumentMouseUp)
      return () => {
        document.removeEventListener('mouseup', handleDocumentMouseUp)
      }
    }
  }, [isDragging, hoveredIndex, onItemSelect])

  const handlePressStart = event => {
    event.preventDefault()
    wasLongPress.current = false
    setIsDragging(false)
    const target = event.currentTarget
    pressTimer.current = setTimeout(() => {
      wasLongPress.current = true
      setIsDragging(true)
      setAnchorEl(target)
    }, 333)
  }

  const handlePressEnd = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current)
      pressTimer.current = null
    }

    // Only handle immediate release (not dragging)
    if (!isDragging) {
      handleClose()
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
    setHoveredIndex(-1)
    setIsDragging(false)
    wasLongPress.current = false
  }

  const handleItemMouseEnter = index => {
    if (isDragging) {
      setHoveredIndex(index)
    }
  }

  const handleItemMouseLeave = () => {
    if (isDragging) {
      setHoveredIndex(-1)
    }
  }

  const handleItemMouseUp = index => {
    if (isDragging) {
      onItemSelect?.(index)
      handleClose()
    }
  }

  const handleItemClick = index => {
    // Only handle click if not dragging
    if (!isDragging) {
      onItemSelect?.(index)
      handleClose()
    }
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
            <MenuItem
              key={index}
              onClick={() => handleItemClick(index)}
              onMouseEnter={() => handleItemMouseEnter(index)}
              onMouseLeave={handleItemMouseLeave}
              onMouseUp={() => handleItemMouseUp(index)}
              sx={{
                backgroundColor: hoveredIndex === index ? 'action.hover' : 'transparent',
              }}
            >
              {item}
            </MenuItem>
          ))}
        </Menu>
      )}
    </>
  )
}

export default NavHistoryButton
