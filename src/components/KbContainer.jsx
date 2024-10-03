import TaxonomyProvider from "@/contexts/taxonomy/TaxonomyProvider"
import StatusProvider from "@/contexts/status/StatusProvider"

import KnowledgeBase from "@/components/kb/KnowledgeBase"

const KbContainer = () => {
  return (
    <>
      <TaxonomyProvider>
        <StatusProvider>
          <KnowledgeBase />
        </StatusProvider>
      </TaxonomyProvider>
    </>
  )
}

export default KbContainer
