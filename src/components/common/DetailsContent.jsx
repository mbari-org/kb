import FieldDisplay from "./FieldDisplay"

const DetailsContent = ({ details, sx }) => {
  return (
    <>
      {Object.entries(details).map(([key, value]) => (
        <FieldDisplay key={key} field={key} value={value} sx={sx} />
      ))}
    </>
  )
}

export default DetailsContent
