import aliasAdd from '@/text/config/panels/concepts/modals/alias/add.json'
import aliasDelete from '@/text/config/panels/concepts/modals/alias/delete.json'
import aliasEdit from '@/text/config/panels/concepts/modals/alias/edit.json'
import button from '@/text/config/panels/concepts/modals/button.json'
import concept from '@/text/config/panels/concepts/modals/group.json'
import mediaAdd from '@/text/config/panels/concepts/modals/media/add.json'
import mediaDelete from '@/text/config/panels/concepts/modals/media/delete.json'
import mediaEdit from '@/text/config/panels/concepts/modals/media/edit.json'
import pending from '@/text/config/panels/concepts/modals/pending.json'
import realizationAdd from '@/text/config/panels/concepts/modals/realization/add.json'
import realizationDelete from '@/text/config/panels/concepts/modals/realization/delete.json'
import realizationEdit from '@/text/config/panels/concepts/modals/realization/edit.json'
import staged from '@/text/config/panels/concepts/modals/staged.json'

export const MODALS = {
  ALIAS: {
    ADD: aliasAdd,
    DELETE: aliasDelete,
    EDIT: aliasEdit,
  },
  BUTTON: button,
  CONCEPT: concept,
  MEDIA: {
    ADD: mediaAdd,
    DELETE: mediaDelete,
    EDIT: mediaEdit,
  },
  PENDING: pending,
  REALIZATION: {
    ADD: realizationAdd,
    DELETE: realizationDelete,
    EDIT: realizationEdit,
  },
  STAGED: staged,
}
