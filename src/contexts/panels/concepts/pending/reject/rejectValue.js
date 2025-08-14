const rejectValue = (concept, pendingItem) => {
  concept[pendingItem.field] = pendingItem.oldValue
}

export default rejectValue
