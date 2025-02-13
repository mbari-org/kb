import FieldValueDisplay from "./FieldValueDisplay"

const DetailsContent = ({ details, sx }) => {
  return (
    <>
      {Object.entries(details).map(([field, value]) => (
        <FieldValueDisplay key={field} field={field} value={value} sx={sx} />
      ))}
    </>
  )
}

export default DetailsContent
