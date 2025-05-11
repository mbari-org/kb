const CONCEPT_NAME_TYPES = {
  COMMON: 'Common',
  FORMER: 'Former',
  PRIMARY: 'Primary',
  SYNONYM: 'Synonym',
}

const LABELS = {
  BUTTON: {
    BACK_TO_EDIT: 'Back to Editing',
    CONFIRM_DISCARD: 'Confirm Discard',
    REJECT_DISCARD: 'Keep Edit',
    CONTINUE: 'Continue',
    DISCARD: 'Discard',
    DISCARD_ALL: 'Discard All',
    STAGE: 'Stage',
  },
  CONCEPT: {
    CHANGE_NAME: {
      ASSOCIATED_DATA: 'Associated Data',
      NAME_ONLY: 'Name Only',
    },
    ACTION: {
      CANCEL: 'Cancel',
      DEFER: 'Defer',
      DELETE: 'Delete Concept',
      DISCARD: 'Discard',
      EDIT: 'Edit',
      PENDING: 'Pending',
      REJECT: 'Reject',
      SAVE: 'Save',
      SHOW: 'Staged',
    },
  },
}

const PROCESSING = {
  LOADING: 'Loading...',
  LOADING_DELAY: 333,
  SAVING: 'Saving...',
}

const RANK = {
  LEVEL: 'rankLevel',
  NAME: 'rankName',
}

const RESETTING = {
  ME: 'Me',
  NONE: 'None',
  OTHER: 'Other',
}

const ROLES = {
  ADMIN: 'Admin',
  MAINT: 'Maint',
  READ_ONLY: 'ReadOnly',
}

export { CONCEPT_NAME_TYPES, LABELS, PROCESSING, RANK, RESETTING, ROLES }
