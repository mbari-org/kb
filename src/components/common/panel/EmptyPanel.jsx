import { Box } from '@mui/material'
import usePanelFactory from '@/components/common/panel/usePanelFactory'

const EmptyPanel = ({ title }) => {
  const { createPanelHeader } = usePanelFactory()

  const header = createPanelHeader({ headerTitle: title })

  return <Box sx={{ mt: 2 }}>{header}</Box>
}

export default EmptyPanel
