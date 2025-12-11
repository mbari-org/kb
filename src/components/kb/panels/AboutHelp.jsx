import EmptyPanel from '@/components/common/panel/EmptyPanel'
import CONFIG from '@/config'
import useVersionTooltip from '@/lib/hooks/useVersionTooltip'
import { getVersion } from '@/version'

const TITLE = CONFIG.PANELS.ABOUT_HELP.TITLE

const AboutHelp = () => {
  const version = getVersion()
  const versionTooltip = useVersionTooltip()

  return <EmptyPanel title={TITLE} subtitle={`v${version}`} subtitleTooltip={versionTooltip} />
}

export default AboutHelp
