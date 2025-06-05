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

const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

const LABELS = {
  BUTTON: {
    APPROVE: 'Approve',
    APPROVE_ALL: 'Approve All',
    BACK_TO_EDIT: 'Back to Editing',
    CANCEL: 'Cancel',
    CLOSE: 'Close',
    CONFIRM: 'Confirm',
    CONFIRM_DISCARD: 'Confirm',
    CONTINUE: 'Continue',
    DEFER: 'Defer',
    DELETE: 'Delete',
    DISCARD: 'Discard',
    DISCARD_ALL: 'Discard All',
    LOCK: 'Lock',
    REJECT: 'Reject',
    REJECT_ALL: 'Reject All',
    REJECT_DISCARD: 'Keep',
    SAVE: 'Save',
    STAGE: 'Stage',
    UNLOCK: 'Unlock',
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

const PAGINATION = {
  HISTORY: {
    DEFAULT_LIMIT: 50,
    PAGE_SIZE_OPTIONS: [5, 10, 25, 50],
  },
  REFERENCES: {
    DEFAULT_LIMIT: 50,
    PAGE_SIZE_OPTIONS: [5, 10, 25, 50],
  },
  USERS: {
    DEFAULT_LIMIT: 25,
    PAGE_SIZE_OPTIONS: [5, 10, 25, 50],
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
  DELETING: 'Deleting...',
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

const SELECTED = {
  HISTORY: {
    TYPE: {
      APPROVED: 'approved',
      CONCEPT: 'concept',
      PENDING: 'pending',
    },
  },
  REFERENCES: {
    BY_CONCEPT: 'byConcept',
  },
}

const STORE = {
  CONCEPT: {
    KEY: 'kb:concepts',
    MAX_SIZE: 50,
  },
  PANEL: {
    KEY: 'kb:panels',
    MAX_SIZE: 50,
  },
}

const USER_ROLES = {
  ADMIN: 'Admin',
  MAINT: 'Maint',
  READ_ONLY: 'ReadOnly',
  USER: 'User',
}

export {
  CONCEPT_FIELDS,
  CONCEPT_NAME_TYPES,
  CONCEPT_STATE,
  EMAIL_REGEX,
  LABELS,
  PAGINATION,
  PENDING,
  PROCESSING,
  RANK,
  RESETTING,
  SELECTED,
  STORE,
  USER_ROLES,
}
