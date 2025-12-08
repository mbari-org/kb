import PanelHeader from '@/components/common/panel/PanelHeader'
import PanelTitle from '@/components/common/panel/PanelTitle'

const PanelHeaderTitle = ({ subtitle, title }) => {
  return <PanelHeader headerTitle={<PanelTitle subtitle={subtitle} title={title} />} />
}

export default PanelHeaderTitle
