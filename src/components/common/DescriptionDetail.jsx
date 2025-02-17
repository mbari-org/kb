import Description from '@/components/common/Description'
import Detail from '@/components/common/Detail'

const DescriptionDetail = props => {
  const { description, detail } = props
  return (
    <>
      <Description id='modal-content-description' description={description} sx={{ mb: 1 }} />
      <Detail id='modal-content-detail' detail={detail} sx={{ mb: 1, ml: 2 }} />
    </>
  )
}

export default DescriptionDetail
