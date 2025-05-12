import FieldValueDisplay from './FieldValueDisplay'

const DetailContent = ({ detail, sx }) => {
  return (
    <>
      {Object.entries(detail).map(([field, value]) => (
        <FieldValueDisplay key={field} field={field} value={value} sx={sx} />
      ))}
    </>
  )
}

export default DetailContent
