import { Box } from '@mui/material'
import PanelHeaderTitle from '@/components/common/panel/PanelHeaderTitle'
import usePanelFactory from '@/components/common/panel/usePanelFactory'

const EmptyPanel = ({ title }) => {
  const { createPanelHeader } = usePanelFactory()

  const header = createPanelHeader({
    headerTitle: <PanelHeaderTitle title={title} />,
  })

  return <Box>{header}</Box>
}

export default EmptyPanel
