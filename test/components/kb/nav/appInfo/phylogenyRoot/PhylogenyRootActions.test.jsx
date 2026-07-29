import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import PhylogenyRootActions from '@/components/kb/nav/appInfo/phylogenyRoot/PhylogenyRootActions'
import AppModalContext from '@/contexts/app/AppModalContext'
import ConfigContext from '@/contexts/config/ConfigContext'
import { PREFS } from '@/lib/constants/prefs'
import CONFIG from '@/lib/config'

const { CANCEL, SAVE } = CONFIG.BUTTON

const renderActions = ({
  confirmCommit = false,
  getConceptPrimaryName,
  onCancel,
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
            onCancel,
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

    await user.click(screen.getByRole('button', { name: SAVE }))
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
    const onCancel = vi.fn()
    const { closeModal, saveAppPreference } = renderActions({
      confirmCommit: true,
      onCancel,
      selectedPhylogenyRoot: 'phyla',
    })

    await user.click(screen.getByRole('button', { name: SAVE }))

    expect(saveAppPreference).toHaveBeenCalledWith(PREFS.APP.PHYLOGENY.ROOT.KEY, 'phyla')
    await waitFor(() => {
      expect(closeModal).toHaveBeenCalledWith(true)
    })
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('converts selected alias to concept primary name when save is confirmed', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    const { closeModal, saveAppPreference } = renderActions({
      confirmCommit: true,
      onCancel,
      selectedPhylogenyRoot: 'wolf-alias',
      getConceptPrimaryName: vi.fn(name => {
        if (name === 'wolf-alias') {
          return 'canis lupus'
        } else {
          return name
        }
      }),
    })

    await user.click(screen.getByRole('button', { name: SAVE }))

    expect(saveAppPreference).toHaveBeenCalledWith(PREFS.APP.PHYLOGENY.ROOT.KEY, 'canis lupus')
    await waitFor(() => {
      expect(closeModal).toHaveBeenCalledWith(true)
    })
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('disables save when selected root matches current phylogeny root', () => {
    renderActions({
      phylogenyRoot: 'canis lupus',
      selectedPhylogenyRoot: 'canis lupus',
    })

    expect(screen.getByRole('button', { name: SAVE })).toBeDisabled()
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

    expect(screen.getByRole('button', { name: SAVE })).toBeDisabled()
  })

  it('reopens app info when cancel is clicked and a cancel callback exists', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    const { closeModal } = renderActions({ onCancel, selectedPhylogenyRoot: 'phyla' })

    await user.click(screen.getByRole('button', { name: CANCEL }))

    expect(closeModal).toHaveBeenCalledWith(false)
    expect(onCancel).toHaveBeenCalledTimes(1)
  })
})
