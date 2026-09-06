import { Box } from '@mui/material'
import PanelHeaderTitle from './PanelHeaderTitle'
import usePanelFactory from './usePanelFactory'

const EmptyPanel = ({ title }) => {
  const { createPanelHeader } = usePanelFactory()

  const header = createPanelHeader({
    headerTitle: <PanelHeaderTitle title={title} />,
  })

  return <Box>{header}</Box>
}

export default EmptyPanel
