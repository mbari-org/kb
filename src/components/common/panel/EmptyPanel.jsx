import { Box } from '@mui/material'
import usePanelFactory from '@/components/common/panel/usePanelFactory'

const EmptyPanel = ({ subtitle, title }) => {
  const { createPanelHeader } = usePanelFactory()

  const header = createPanelHeader({ title, subtitle })

  return <Box sx={{ mt: 1 }}>{header}</Box>
}

export default EmptyPanel
