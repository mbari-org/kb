import { useEffect, useCallback, useState } from 'react'
import Divider from '@mui/material/Divider'

const MIN_WIDTH = 350
const MAX_WIDTH = 750

const ConceptDivider = ({ setSidebarWidth }) => {
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDown = useCallback(() => {
    setIsDragging(true)
  }, [])

  const handleMouseMove = useCallback(
    event => {
      if (isDragging) {
        const newWidth = Math.min(Math.max(event.clientX, MIN_WIDTH), MAX_WIDTH)
        setSidebarWidth(newWidth)
      }
    },
    [isDragging, setSidebarWidth]
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleDoubleClick = useCallback(() => {
    setSidebarWidth(prevWidth => (prevWidth < MIN_WIDTH + 5 ? MAX_WIDTH : MIN_WIDTH))
  }, [setSidebarWidth])

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    } else {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  useEffect(() => {
    setSidebarWidth(MIN_WIDTH)
  }, [setSidebarWidth])

  return (
    <Divider
      flexItem
      orientation='vertical'
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      sx={{ borderRightWidth: 6, cursor: 'col-resize' }}
    />
  )
}

export default ConceptDivider
