import { loadDescendants } from "@/model/taxonomy"

import { getConceptPath } from "./taxonomyItem"

const useExpandDescendants = (setExpandedItems, taxonomy) => {
  const allLeafs = (concept, leafs = []) => {
    if (concept.children && 0 < concept.children.length) {
      leafs.push(concept.name)
      concept.children.forEach(child => allLeafs(child, leafs))
    }
    return leafs
  }

  const expandDescendants = (concept, expand = true) => {
    if (expand) {
      loadDescendants(taxonomy, concept).then(() => {
        const leafs = allLeafs(concept)
        setExpandedItems(prevItems => [...new Set([...prevItems, ...leafs])])
      })
    } else {
      setExpandedItems(getConceptPath(taxonomy, concept))
    }
  }

  return expandDescendants
}

export default useExpandDescendants
