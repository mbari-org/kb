import EmptyPanel from '@/components/common/panel/EmptyPanel'
import { CONFIG } from '@/config/js/index.js'
import { getVersion } from '@/version'

const TITLE = CONFIG.PANELS.ABOUT_HELP.TITLE

const AboutHelp = () => {
  const version = getVersion()

  return <EmptyPanel title={TITLE} subtitle={`v${version}`} />
}

export default AboutHelp
