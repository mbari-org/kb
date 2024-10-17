import { forwardRef } from "react"

import { alpha, styled } from "@mui/material/styles"
import { TreeItem2 } from "@mui/x-tree-view/TreeItem2"

import ExpandConcept from "./ExpandConcept"

const ConceptContent = styled("div")(({ theme }) => ({
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  width: "100%",

  display: "flex",
  "&:hover": {
    backgroundColor: alpha((theme.vars || theme).palette.primary.main, 0.2),
  },
  variants: [
    {
      props: ({ isSelected }) => isSelected,
      style: {
        backgroundColor: alpha((theme.vars || theme).palette.primary.main, 0.3),
        border: "1px solid",
      },
    },
  ],
}))

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
        groupTransition: ExpandConcept,
      }}
    />
  )
})

export default ConceptItem
