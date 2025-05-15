const ChildrenDetail = ({ pending }) => {
  const pendingChildren = pending('Concept.child')

  if (pendingChildren.length === 0) {
    return null
  }

  return <div>CxInc: ChildrenDetail</div>
}

export default ChildrenDetail
