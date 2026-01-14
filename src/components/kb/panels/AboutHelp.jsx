import { Box } from '@mui/material'

import PanelHeaderTitle from '@/components/common/panel/PanelHeaderTitle'
import usePanelFactory from '@/components/common/panel/usePanelFactory'

import CONFIG from '@/text'
import useVersionTooltip from '@/lib/hooks/useVersionTooltip'
import { getVersion } from '@/version'

const TITLE = CONFIG.PANELS.ABOUT_HELP.TITLE

const AboutHelp = () => {
  const version = getVersion()
  const versionTooltip = useVersionTooltip()
  const { createPanelHeader } = usePanelFactory()

  const header = createPanelHeader({
    headerTitle: (
      <PanelHeaderTitle subtitle={`v${version}`} subtitleTooltip={versionTooltip} title={TITLE} />
    ),
  })

  return <Box sx={{ mt: 1 }}>{header}</Box>
}

export default AboutHelp
