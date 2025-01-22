import { Box } from "@mui/material"

import Action from "./Action"

const Actions = ({ colors, labels, onAction }) => {
  const actionColor = index => (colors ? colors[index] : "main")

  const actions = labels.map((label, index) => (
    <Action
      key={index}
      color={actionColor(index)}
      index={index}
      label={label}
      totalActions={labels.length}
      onAction={onAction}
    />
  ))

  return (
    <Box
      sx={{
        backgroundColor: "inherit",
        display: "flex",
        justifyContent: "space-between",
        mt: 4,
        padding: 1,
        width: "100%",
      }}
    >
      {actions}
    </Box>
  )
}

export default Actions
