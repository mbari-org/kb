import { Typography } from "@mui/material"

import ModalBox from "./ModalBox"

const ModalTitledBox = ({ children, onClose, open, title, titleColor }) => {
  const color = titleColor || "primary"

  return (
    <ModalBox open={open} onClose={onClose}>
      <Typography
        id="modal-titled-box"
        variant="h5"
        component="h2"
        sx={{
          borderBottom: "1px solid #000",
          color,
          fontWeight: "bold",
          pb: 1,
          textAlign: "center",
          width: "100%",
        }}
      >
        {title}
      </Typography>
      {children}
    </ModalBox>
  )
}

export default ModalTitledBox
