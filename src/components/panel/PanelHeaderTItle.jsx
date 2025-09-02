import PanelHeader from '@/components/common/panel/PanelHeader'
import PanelTitle from '@/components/common/panel/PanelTitle'

const PanelHeaderTitle = ({ title }) => {
  return <PanelHeader headerTitle={<PanelTitle title={title} />} />
}

export default PanelHeaderTitle
