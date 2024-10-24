import { styled } from "@mui/material/styles"

import ConceptText from "./ConceptText"

const ConceptLabel = ({ children }) => {
  return <ConceptText>{children}</ConceptText>
}

export default styled("div")(ConceptLabel)
