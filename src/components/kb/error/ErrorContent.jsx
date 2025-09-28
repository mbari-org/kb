import { Stack } from '@mui/material'
import DescriptionDetail from '@/components/common/DescriptionDetail'

const ErrorContent = ({ error }) => {
  const { details = {}, message, title } = error

  return (
    <Stack spacing={2}>
      <DescriptionDetail
        description={title}
        detail={message}
      />
      {Object.keys(details).length > 0 && (
        <DescriptionDetail
          description='Details'
          detail={details}
        />
      )}
    </Stack>
  )
}

export default ErrorContent
