import TaxonomyProvider from "@/contexts/taxonomy/TaxonomyProvider"
import SelectedProvider from "@/contexts/selected/SelectedProvider"

import KnowledgeBase from "@/components/kb/KnowledgeBase"

const KbContainer = () => {
  return (
    <TaxonomyProvider>
      <SelectedProvider>
        <KnowledgeBase />
      </SelectedProvider>
    </TaxonomyProvider>
  )
}

export default KbContainer
