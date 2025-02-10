import FieldDisplay from "./FieldDisplay"

const DetailContent = ({ detail, sx }) => {
  return (
    <>
      {Object.entries(detail).map(([key, value]) => (
        <FieldDisplay key={key} field={key} value={value} sx={sx} />
      ))}
    </>
  )
}

export default DetailContent
