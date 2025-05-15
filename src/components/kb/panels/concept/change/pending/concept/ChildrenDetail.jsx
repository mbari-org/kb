const ChildrenDetail = ({ pending }) => {
  const pendingChildren = pending('Concept')

  if (pendingChildren.length === 0) {
    return null
  }

  return <div>ChildrenDetail</div>
}

export default ChildrenDetail
