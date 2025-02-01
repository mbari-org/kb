import EditMediaForm from "../EditMediaForm"

const AddMediaContent = ({ mediaIndex, formRef }) => {
  const onSubmit = () => {
    console.log("CxInc: Add Media onSubmit at mediaIndex", mediaIndex)
  }

  return (
    <EditMediaForm mediaIndex={mediaIndex} onSubmit={onSubmit} ref={formRef} />
  )
}

export default AddMediaContent
