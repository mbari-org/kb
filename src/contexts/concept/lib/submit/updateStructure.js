import {
  createConcept,
  updateConceptName,
  updateConceptParent,
} from '@/lib/services/oni/api/concept'

import { prunePick } from '@/lib/util'

const updateStructure = (concept, updates, submit) => {
  const { children, name, nameChange, parentName } = prunePick(updates, [
    'children',
    'name',
    'nameChange',
    'parentName',
  ])
  if (!children && !name && !nameChange && !parentName) {
    return []
  }

  const submitters = []

  if (name) {
    submitters.push(submit(updateConceptName, { name }))
  }

  if (nameChange) {
    // submitters.push(submit(updateConceptName, { name: nameChange }))
  }

  if (parentName) {
    submitters.push(submit(updateConceptParent, { parentName }))
  }

  if (children) {
    children.staged.reduce((acc, child) => {
      acc.push(() => submit(createConcept, { ...child, parentName: concept.name }))
      return acc
    }, submitters)
  }

  return submitters
}

export default updateStructure
