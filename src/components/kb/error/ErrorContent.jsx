import { Typography } from '@mui/material'

import DescriptionDetail from '@/components/common/DescriptionDetail'

const ErrorContent = ({ error }) => {
  return (
    <DescriptionDetail
      description={error.title}
      detail={{
        url: error.url,
        message: error.message,
      }}
    />
  )
}

export default ErrorContent
