import TaxonomyContext from "@/contexts/taxonomy/TaxonomyContext"

const TaxonomyProvider = ({ children }) => {
  return <TaxonomyContext value={{}}>{children}</TaxonomyContext>
}

export default TaxonomyProvider
