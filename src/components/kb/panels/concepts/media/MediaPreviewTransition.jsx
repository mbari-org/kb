import { forwardRef } from "react"
import { Slide } from "@mui/material"

const PreviewTransition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

export default PreviewTransition
