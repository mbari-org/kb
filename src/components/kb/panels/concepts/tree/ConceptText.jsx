const TextProps = {
  color: "inherit",
  fontFamily: "General Sans",
  fontWeight: 700,
}

const ConceptText = props => <TextProps variant="body2" {...props} />

export default styled(Typography)(ConceptText)
