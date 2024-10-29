import { useRef, useState } from "react"

import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"

import ConceptSearch from "@/components/kb/panels/concepts/ConceptSearch"
import TaxonomyTree from "@/components/kb/panels/concepts/tree/TaxonomyTree"

const TaxonomySidebar = ({ concept }) => {
  const sidebarRef = useRef(null)

  const [autoExpand, setAutoExpand] = useState(null)

  return (
    <>
      <Stack sx={{ height: "100%" }}>
        <Box sx={{ ml: 1, mt: 1, mr: 1 }}>
          <ConceptSearch concept={concept} setAutoExpand={setAutoExpand} />
        </Box>
        <Box
          ref={sidebarRef}
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            ml: 1,
            mr: 1,
            outline: "none",
            overflowY: "auto",
          }}
          tabIndex={0}
        >
          <TaxonomyTree
            autoExpand={autoExpand}
            concept={concept}
            setAutoExpand={setAutoExpand}
            sidebarRef={sidebarRef}
            style={{ flexGrow: 1, height: "100%" }}
          />
        </Box>
      </Stack>
    </>
  )
}

export default TaxonomySidebar