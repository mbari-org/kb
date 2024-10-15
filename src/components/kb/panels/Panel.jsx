import panels from "@/lib/panels"

const Panel = ({ name }) => {
  const panel = panels.find(p => p.name === name)
  return <panel.mod id={`kb-panel-${name}`} />
}

export default Panel