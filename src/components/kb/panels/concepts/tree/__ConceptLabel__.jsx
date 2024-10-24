import { styled } from "@mui/material/styles"

import ConceptText from "./__ConceptText__"

const ConceptLabel = ({ children }) => {
  return <ConceptText>{children}</ConceptText>
}

export default styled("div")(ConceptLabel)
