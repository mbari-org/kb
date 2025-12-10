import aliasAdd from '@/config/text/panels/concepts/modals/alias/add.json'
import aliasDelete from '@/config/text/panels/concepts/modals/alias/delete.json'
import aliasEdit from '@/config/text/panels/concepts/modals/alias/edit.json'
import button from '@/config/text/panels/concepts/modals/button.json'
import concept from '@/config/text/panels/concepts/modals/group.json'
import mediaAdd from '@/config/text/panels/concepts/modals/media/add.json'
import mediaDelete from '@/config/text/panels/concepts/modals/media/delete.json'
import mediaEdit from '@/config/text/panels/concepts/modals/media/edit.json'
import pending from '@/config/text/panels/concepts/modals/pending.json'
import staged from '@/config/text/panels/concepts/modals/staged.json'

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
  STAGED: staged,
}
