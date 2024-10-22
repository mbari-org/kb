import { forwardRef } from "react"

import { alpha, styled } from "@mui/material/styles"
import { TreeItem2 } from "@mui/x-tree-view/TreeItem2"

import ExpandConcept from "./ExpandConcept"

const ConceptContent = styled("div")(({ theme, isSelected }) => {
  return {
    borderRadius: theme.spacing(0.8),
    display: "flex",
    flexDirection: "row-reverse",
    fontWeight: 700,
    padding: theme.spacing(0.5, 1),
    width: "100%",
    "&:hover": !isSelected && {
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
      color: theme.palette.primary.main,
      fontStyle: "italic",
    },
    variants: [
      {
        props: ({ isSelected }) => isSelected,
        style: {
          backgroundColor: theme.palette.primary.dark,
          border: "1px solid",
          color: theme.palette.primary.contrastText,
          ...theme.applyStyles("light", {
            backgroundColor: theme.palette.primary.main,
          }),
        },
      },
    ],
  }
})

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
