import aliases from '@/config/panels/concepts/aliases.json'
import author from '@/config/panels/concepts/author.json'
import panel from '@/config/panels/concepts/panel.json'
import rank from '@/config/panels/concepts/rank.json'
import realizations from '@/config/panels/concepts/realizations.json'
import references from '@/config/panels/concepts/references.json'
import templates from '@/config/panels/concepts/templates.json'
import { BUTTON } from '../button.js'

import { MODALS } from './concepts/modals.js'


export const CONCEPTS = {
  ALIASES: aliases,
  AUTHOR: author,
  BUTTON: {
    CANCEL: BUTTON.CANCEL,
    DISCARD: BUTTON.DISCARD,
    DISCARD_ALL: BUTTON.DISCARD_ALL,
    EDIT: BUTTON.EDIT,
    PENDING: BUTTON.PENDING,
    SAVE: BUTTON.SAVE,
    STAGED: BUTTON.STAGED,
  },
  MODALS,
  PANEL: panel,
  RANK: rank,
  REALIZATIONS: realizations,
  REFERENCES: references,
  TEMPLATES: templates,
}
