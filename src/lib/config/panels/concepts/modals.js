import aliasAdd from '@/config/panels/concepts/modals/alias/add.json'
import aliasDelete from '@/config/panels/concepts/modals/alias/delete.json'
import aliasEdit from '@/config/panels/concepts/modals/alias/edit.json'
import concept from '@/config/panels/concepts/modals/group.json'
import item from '@/config/panels/concepts/modals/item.json'
import itemTitles from '@/config/panels/concepts/modals/itemTitles.json'
import mediaAdd from '@/config/panels/concepts/modals/media/add.json'
import mediaDelete from '@/config/panels/concepts/modals/media/delete.json'
import mediaEdit from '@/config/panels/concepts/modals/media/edit.json'
import mediaPrimary from '@/config/panels/concepts/modals/media/primary.json'
import mediaUrl from '@/config/panels/concepts/modals/media/url.json'
import pending from '@/config/panels/concepts/modals/pending.json'
import realizationAdd from '@/config/panels/concepts/modals/realization/add.json'
import realizationDelete from '@/config/panels/concepts/modals/realization/delete.json'
import realizationEdit from '@/config/panels/concepts/modals/realization/edit.json'
import staged from '@/config/panels/concepts/modals/staged.json'
import addChild from '@/config/panels/concepts/modals/hierarchy/addChild.json'
import changeName from '@/config/panels/concepts/modals/hierarchy/changeName.json'
import changeParent from '@/config/panels/concepts/modals/hierarchy/changeParent.json'
import deleteConcept from '@/config/panels/concepts/modals/hierarchy/deleteConcept.json'
import toConcept from '@/config/panels/concepts/modals/hierarchy/toConcept.json'

export const MODALS = {
  ALIAS: {
    ADD: aliasAdd,
    DELETE: aliasDelete,
    EDIT: aliasEdit,
  },
  CONCEPT: concept,
  ITEM: item,
  ITEM_TITLES: itemTitles,
  MEDIA: {
    ADD: mediaAdd,
    DELETE: mediaDelete,
    EDIT: mediaEdit,
    PRIMARY: mediaPrimary,
    URL: mediaUrl,
  },
  PENDING: pending,
  REALIZATION: {
    ADD: realizationAdd,
    DELETE: realizationDelete,
    EDIT: realizationEdit,
  },
  STAGED: staged,
  HIERARCHY: {
    ADD_CHILD: addChild,
    CHANGE_NAME: changeName,
    CHANGE_PARENT: changeParent,
    DELETE_CONCEPT: deleteConcept,
    TO_CONCEPT: toConcept,
  },
}
