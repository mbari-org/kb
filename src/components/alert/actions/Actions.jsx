import { Box } from "@mui/material"

import Action from "./Action"

const Actions = ({ colors, disabled, labels, onAction }) => {
  const actionColor = index => (colors ? colors[index] : "main")

  const actions = labels.map((label, index) => (
    <Action
      color={actionColor(index)}
      disabled={disabled && disabled[index]}
      index={index}
      key={index}
      label={label}
      onAction={onAction}
      totalActions={labels.length}
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
