import { Box } from '@mui/material'
import usePanelFactory from '@/components/common/panel/usePanelFactory'

const EmptyPanel = ({ subtitle, subtitleTooltip, title }) => {
  const { createPanelHeader } = usePanelFactory()

  const header = createPanelHeader({ headerTitle: title, subtitle, subtitleTooltip })

  return <Box sx={{ mt: 1 }}>{header}</Box>
}

export default EmptyPanel
