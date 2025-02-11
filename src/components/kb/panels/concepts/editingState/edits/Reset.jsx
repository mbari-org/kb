import { Button } from "@mui/material"
import { IoClose } from "react-icons/io5"

const Reset = ({ onClick }) => {
  return (
    <Button
      color="cancel"
      onClick={onClick}
      sx={{
        mr: 0.5,
        minWidth: "auto",
      }}
    >
      <IoClose />
    </Button>
  )
}

export default Reset
