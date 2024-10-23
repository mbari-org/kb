import { forwardRef } from "react"

import { TreeItem2 } from "@mui/x-tree-view/TreeItem2"

import ConceptContent from "./ConceptContent"
import ConceptsExpand from "./ConceptsExpand"

const ConceptItem = forwardRef(function ConceptItem(props, ref) {
  const { concept, itemId } = props
  const isSelected = itemId === concept.name

  return (
    <TreeItem2
      {...props}
      ref={ref}
      slotProps={{ content: { isSelected } }}
      slots={{
        content: ConceptContent,
        groupTransition: ConceptsExpand,
      }}
    />
  )
})

export default ConceptItem
