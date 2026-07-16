export const PREFS = {
  USER: {
    AUTOSAVE_MILLIS: 15_000,
    KEY: {
      CONCEPTS: 'concepts',
      PANELS: 'panels',
      SETTINGS: 'settings',
    },
    MAX_LENGTH: 255,
    PREFIX: 'kb-ui/',
  },
  APP: {
    PREFIX: 'kb-app',
    MEDIA: {
      BASE_URL: {
        ROOT: {
          DEFAULT: '',
          KEY: 'media-base-url',
        },
      },
    },
    PHYLOGENY: {
      ROOT: {
        DEFAULT: 'marine organism',
        KEY: 'phylogeny-root',
      },
    },
  },
  AUTH: {
    LOCAL_STORE: 'kb:auth',
  },
}
