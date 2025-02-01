import EditMediaForm from "./EditMediaForm"

const EditMediaContent = ({ mediaIndex, formRef }) => {
  return <EditMediaForm mediaIndex={mediaIndex} ref={formRef} />
}

export default EditMediaContent
