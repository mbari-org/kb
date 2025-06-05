import panels from '@/components/kb/panels/panels'

const Panel = ({ name }) => {
  const panel = panels.find(p => p.name === name)
  return <panel.module id={`kb-panel-${name}`} />
}

export default Panel
