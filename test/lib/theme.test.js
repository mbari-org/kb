import { describe, expect, it } from 'vitest'

import theme from '@/lib/theme'
import color from '@/config/color.json'

describe('theme color configuration', () => {
  it('uses the configured background for paper and default surfaces', () => {
    expect(theme.palette.background.default).toBe(color.COLOR.BACKGROUND)
    expect(theme.palette.background.paper).toBe(color.COLOR.BACKGROUND)
  })

  it('uses configured action and semantic colors', () => {
    const { ACTION, CANCEL, CLEAN, CONCEPT_DETAIL } = color.COLOR

    expect(theme.palette.add.main).toBe(ACTION.ADD)
    expect(theme.palette.approve.main).toBe(ACTION.ADD)
    expect(theme.palette.edit.main).toBe(ACTION.EDIT)
    expect(theme.palette.remove.main).toBe(ACTION.DELETE)
    expect(theme.palette.cancel.main).toBe(CANCEL)
    expect(theme.palette.reject.main).toBe(CANCEL)
    expect(theme.palette.clean.main).toBe(CLEAN)
    expect(theme.concept.color).toMatchObject({
      add: ACTION.ADD,
      clean: CLEAN,
      detail: CONCEPT_DETAIL,
      edit: ACTION.EDIT,
      pending: ACTION.EDIT,
      remove: ACTION.DELETE,
    })
  })
})
