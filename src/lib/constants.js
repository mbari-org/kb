const CONCEPT_FIELDS = {
  ALIASES: 'aliases',
  MEDIA: 'media',
  PARENT: 'parent',
  PRIMARY: {
    NAME: 'name',
    AUTHOR: 'author',
  },
  RANK: {
    NAME: 'name',
    LEVEL: 'level',
  },
  STRUCTURE: {
    CHILD: 'child',
    CONCEPT: 'concept',
    NAME: 'name',
    PARENT: 'parent',
  },
}

const CONCEPT_NAME_TYPES = {
  COMMON: 'Common',
  FORMER: 'Former',
  PRIMARY: 'Primary',
  SYNONYM: 'Synonym',
}

const CONCEPT_STATE = {
  ALIAS: {
    ADD: 'Alias Add',
    DELETE: 'Alias Delete',
    EDIT: 'Alias Edit',
  },
  FIELD: {
    SET: 'Field Set',
  },
  INITIAL: 'Initial State',
  MEDIA: {
    ADD: 'Media Add',
    DELETE: 'Media Delete',
    EDIT: 'Media Edit',
  },
  NO_ACTION: 'None',
  RESET: {
    CONFIRMED: {
      NO: 'Discard Reset',
      YES: 'Perform Reset',
    },
    ADD_CHILD: 'Reset Add Child',
    ADD_CHILDREN: 'Reset Add Children',
    ALIAS: 'Reset Alias',
    ALIASES: 'Reset Aliases',
    CHANGE_NAME: 'Reset Change Name',
    CHANGE_PARENT: 'Reset Change Parent',
    DELETE_CONCEPT: 'Reset Delete Concept',
    FIELD: 'Reset Field',
    MEDIA: 'Reset Media',
    MEDIA_ITEM: 'Reset Media Item',
    TO_INITIAL: 'Reset To Initial',
  },
  STRUCTURE: {
    ADD_CHILD: 'Add Child',
    CHANGE_NAME: 'Change Name',
    CHANGE_PARENT: 'Change Parent',
    DELETE_CONCEPT: 'Delete Concept',
  },
}

const LABELS = {
  BUTTON: {
    APPROVE: 'Approve',
    APPROVE_ALL: 'Approve All',
    BACK_TO_EDIT: 'Back to Editing',
    CONFIRM: 'Confirm',
    CONFIRM_DISCARD: 'Confirm',
    CONTINUE: 'Continue',
    DEFER: 'Defer',
    DISCARD: 'Discard',
    DISCARD_ALL: 'Discard All',
    REJECT: 'Reject',
    REJECT_ALL: 'Reject All',
    REJECT_DISCARD: 'Keep',
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
      REJECT_ALL: 'Reject All',
      SAVE: 'Save',
      SHOW: 'Staged',
    },
  },
}

const PENDING = {
  APPROVAL: {
    ACCEPT: 'approve',
    OTHER: 'other',
    REJECT: 'reject',
  },
  GROUP: {
    ALIASES: 'Aliases',
    ALL: 'All',
    CONCEPT_NAME: 'ConceptName',
    MEDIA: 'Media',
    RANK: 'Rank',
  },
}

const PROCESSING = {
  LOADING: 'Loading...',
  LOADING_DELAY: 333,
  SAVING: 'Saving...',
  UPDATING: 'Updating...',
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

export {
  CONCEPT_FIELDS,
  CONCEPT_NAME_TYPES,
  CONCEPT_STATE,
  LABELS,
  PENDING,
  PROCESSING,
  RANK,
  RESETTING,
  ROLES,
}
