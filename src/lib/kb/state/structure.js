import { pick } from '@/lib/utils'

const structureState = concept => {
  return {
    children: [],
    delete: false,
    name: concept.name,
    nameExtent: '',
    parent: concept.parent,
  }
}

const addChild = (state, update) => {
  return {
    ...state,
    children: [...state.children, update.child],
  }
}

const setStructure = (state, update) => {
  const structureUpdate = pick(update, ['delete', 'name', 'nameExtent', 'parent'])
  return {
    ...state,
    ...structureUpdate,
  }
}

const resetAddChild = (state, update) => {
  const { child } = update
  return {
    ...state,
    children: state.children.map(item => (item.name === child.name ? child : item)),
  }
}

const resetAddChildren = state => {
  return {
    ...state,
    children: [],
  }
}

export { addChild, resetAddChild, resetAddChildren, setStructure, structureState }
