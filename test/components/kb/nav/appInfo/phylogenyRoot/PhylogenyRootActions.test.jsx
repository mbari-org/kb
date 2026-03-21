import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import PhylogenyRootActions from '@/components/kb/nav/appInfo/phylogenyRoot/PhylogenyRootActions'
import AppModalContext from '@/contexts/app/AppModalContext'
import ConfigContext from '@/contexts/config/ConfigContext'
import { PREFS } from '@/lib/constants/prefs'
import CONFIG from '@/text'

const renderActions = ({
  confirmCommit = false,
  getConceptPrimaryName,
  phylogenyRoot = 'root',
  selectedPhylogenyRoot = '',
} = {}) => {
  const closeModal = vi.fn(() => true)
  const saveAppPreference = vi.fn(() => Promise.resolve())
  const setModalData = vi.fn()

  render(
    <ConfigContext.Provider value={{ phylogenyRoot, saveAppPreference }}>
      <AppModalContext.Provider
        value={{
          closeModal,
          modalData: {
            confirmCommit,
            selectedPhylogenyRoot,
            getConceptPrimaryName,
          },
          setModalData,
        }}
      >
        <PhylogenyRootActions />
      </AppModalContext.Provider>
    </ConfigContext.Provider>
  )

  return {
    closeModal,
    setModalData,
    saveAppPreference,
  }
}

describe('PhylogenyRootActions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('enters verify state on first save click before persisting phylogeny root', async () => {
    const user = userEvent.setup()
    const { closeModal, saveAppPreference, setModalData } = renderActions({
      selectedPhylogenyRoot: 'phyla',
    })

    await user.click(screen.getByRole('button', { name: 'Save' }))
    expect(saveAppPreference).not.toHaveBeenCalled()
    expect(closeModal).not.toHaveBeenCalled()
    expect(setModalData).toHaveBeenCalledTimes(1)
    const modalUpdater = setModalData.mock.calls[0][0]
    expect(typeof modalUpdater).toBe('function')

    const updatedData = modalUpdater({})
    expect(updatedData.confirmCommit).toBe(true)
    expect(updatedData.alert).toEqual({
      lines: CONFIG.PANELS.ABOUT_HELP.PHYLOGENY_ROOT.ALERT.SAVE_CONFIRM.LINES,
      severity: CONFIG.PANELS.ABOUT_HELP.PHYLOGENY_ROOT.ALERT.SAVE_CONFIRM.SEVERITY,
    })
  })

  it('saves selected root as-is when save is confirmed', async () => {
    const user = userEvent.setup()
    const { closeModal, saveAppPreference } = renderActions({
      confirmCommit: true,
      selectedPhylogenyRoot: 'phyla',
    })

    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(saveAppPreference).toHaveBeenCalledWith(PREFS.APP.PHYLOGENY.KEY, 'phyla')
    await waitFor(() => {
      expect(closeModal).toHaveBeenCalledWith(true)
    })
  })

  it('converts selected alias to concept primary name when save is confirmed', async () => {
    const user = userEvent.setup()
    const { closeModal, saveAppPreference } = renderActions({
      confirmCommit: true,
      selectedPhylogenyRoot: 'wolf-alias',
      getConceptPrimaryName: vi.fn(name => {
        if (name === 'wolf-alias') {
          return 'canis lupus'
        } else {
          return name
        }
      }),
    })

    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(saveAppPreference).toHaveBeenCalledWith(PREFS.APP.PHYLOGENY.KEY, 'canis lupus')
    await waitFor(() => {
      expect(closeModal).toHaveBeenCalledWith(true)
    })
  })

  it('disables save when selected root matches current phylogeny root', () => {
    renderActions({
      phylogenyRoot: 'canis lupus',
      selectedPhylogenyRoot: 'canis lupus',
    })

    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
  })

  it('disables save when selected alias resolves to current phylogeny root', () => {
    renderActions({
      phylogenyRoot: 'canis lupus',
      selectedPhylogenyRoot: 'wolf-alias',
      getConceptPrimaryName: vi.fn(name => {
        if (name === 'wolf-alias') {
          return 'canis lupus'
        } else {
          return name
        }
      }),
    })

    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
  })
})
