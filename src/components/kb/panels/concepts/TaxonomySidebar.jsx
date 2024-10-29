import { useRef, useState } from "react"

import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"

import ConceptSearch from "@/components/kb/panels/concepts/ConceptSearch"
import TaxonomyTree from "@/components/kb/panels/concepts/tree/TaxonomyTree"

const TaxonomySidebar = ({ concept, taxonomy }) => {
  const sidebarRef = useRef(null)

  const [autoExpand, setAutoExpand] = useState(null)

  return (
    <>
      <Stack sx={{ height: "100vh" }}>
        <Box sx={{ ml: 1, mt: 1, mr: 1 }}>
          <ConceptSearch
            concept={concept}
            setAutoExpand={setAutoExpand}
            taxonomy={taxonomy}
          />
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
            taxonomy={taxonomy}
          />
        </Box>
      </Stack>
    </>
  )
}

export default TaxonomySidebar
