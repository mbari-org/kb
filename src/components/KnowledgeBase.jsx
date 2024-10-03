import TaxonomyProvider from "@/contexts/taxonomy/TaxonomyProvider"
import UserProvider from "@/contexts/user/UserProvider"

import NavPanels from "@/components/nav/NavPanels"

const KnowledgeBase = () => {
  return (
    <>
      <TaxonomyProvider>
        <UserProvider>
          <NavPanels />
        </UserProvider>
      </TaxonomyProvider>
    </>
  )
}

export default KnowledgeBase
