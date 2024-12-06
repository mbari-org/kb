import { use, useRef, useState } from "react"

import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"

import ConceptContext from "@/contexts/concept/ConceptContext"

import TaxonomySearch from "@/components/kb/panels/concepts/TaxonomySearch"
import TaxonomyTree from "@/components/kb/panels/concepts/tree/TaxonomyTree"

const TaxonomySidebar = () => {
  const sidebarRef = useRef(null)

  const { concept } = use(ConceptContext)

  const [autoExpand, setAutoExpand] = useState(null)

  return (
    <>
      <Stack sx={{ height: "100%" }}>
        <Box sx={{ ml: 1, mt: 1, mr: 1 }}>
          <TaxonomySearch concept={concept} setAutoExpand={setAutoExpand} />
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
