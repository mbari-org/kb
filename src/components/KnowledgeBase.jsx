import TaxonomyProvider from "@/contexts/taxonomy/TaxonomyProvider"
import StatusProvider from "@/contexts/app/StatusProvider"

import NavPanels from "@/components/nav/NavPanels"

const KnowledgeBase = () => {
  return (
    <>
      <TaxonomyProvider>
        <StatusProvider>
          <NavPanels />
        </StatusProvider>
      </TaxonomyProvider>
    </>
  )
}

export default KnowledgeBase
