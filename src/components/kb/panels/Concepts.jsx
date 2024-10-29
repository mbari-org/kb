import { use, useEffect } from "react"

import Box from "@mui/material/Box"
import Divider from "@mui/material/Divider"
import { useCallback, useState } from "react"

import Concept from "@/components/kb/panels/concepts/Concept"
import TaxonomySidebar from "@/components/kb/panels/concepts/TaxonomySidebar"

import SelectedContext from "@/contexts/selected/SelectedContext"
import TaxonomyContext from "@/contexts/taxonomy/TaxonomyContext"

const Concepts = () => {
  const { getConcept } = use(TaxonomyContext)
  const { selected } = use(SelectedContext)

  const concept = getConcept(selected.concept)

  const [sidebarWidth, setSidebarWidth] = useState(320)
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDown = useCallback(() => {
    setIsDragging(true)
  }, [])

  const handleMouseMove = useCallback(
    event => {
      if (isDragging) {
        const newWidth = Math.min(Math.max(event.clientX, 320), 500)
        setSidebarWidth(newWidth)
      }
    },
    [isDragging]
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleDoubleClick = useCallback(() => {
    setSidebarWidth(prevWidth => (prevWidth < 325 ? 500 : 320))
  }, [])

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
    } else {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  if (!concept) {
    return null
  }

  return (
    <Box sx={{ display: "flex", height: "100%", overflow: "hidden" }}>
      <Box sx={{ width: sidebarWidth }}>
        <TaxonomySidebar concept={concept} />
      </Box>
      <Divider
        flexItem
        orientation="vertical"
        sx={{ borderRightWidth: 6, cursor: "col-resize" }}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
      />
      <Box sx={{ flexGrow: 1, overflowY: "auto", pl: 1 }}>
        <Concept concept={concept} />
      </Box>
    </Box>
  )
}

export default Concepts
