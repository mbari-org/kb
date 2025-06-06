import panelMods from '@/components/kb/panels/modules'

const Panel = ({ name }) => {
  const panel = panelMods.find(p => p.name === name)
  return <panel.module id={`kb-panel-${name}`} />
}

export default Panel
