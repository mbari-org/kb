import EntryDetail from "./EntryDetail"

const DetailContent = ({ detail, sx }) => {
  return (
    <>
      {Object.entries(detail).map(([key, value]) => (
        <EntryDetail key={key} field={key} value={value} sx={sx} />
      ))}
    </>
  )
}

export default DetailContent
