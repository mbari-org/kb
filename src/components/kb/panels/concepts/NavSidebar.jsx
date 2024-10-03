import React from "react"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import { RichTreeView, TreeItem } from "@mui/x-tree-view"

const NavSidebar = () => {
  const treeData = [
    {
      label: "Home",
      children: [{ label: "Dashboard" }, { label: "Settings" }],
    },
    {
      label: "Knowledge Base",
      children: [
        { label: "Introduction" },
        { label: "Getting Started" },
        { label: "Advanced Topics" },
      ],
    },
    {
      label: "Resources",
      children: [
        { label: "Documentation" },
        { label: "Tutorials" },
        { label: "API References" },
      ],
    },
  ]

  return (
    <aside className="left-sidebar">
      <h2>Navigation</h2>
      <RichTreeView
        aria-label="file system navigator"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        sx={{
          height: 240,
          flexGrow: 0,
          overflowY: "auto",
          bgcolor: "background.paper",
          borderRight: 1,
          borderColor: "divider",
        }}
      >
        {treeData.map(node => (
          <TreeItem key={node.label} nodeId={node.label}>
            {node.children
              ? node.children.map(child => (
                  <TreeItem key={child.label} nodeId={child.label}>
                    {child.label}
                  </TreeItem>
                ))
              : node.label}
          </TreeItem>
        ))}
      </RichTreeView>
    </aside>
  )
}

export default NavSidebar
