import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import PhylogenyRootContent from '@/components/kb/nav/appInfo/phylogenyRoot/PhylogenyRootContent'
import AppModalContext from '@/contexts/app/AppModalContext'
import CONFIG from '@/lib/config'

const phylogenyConfig = CONFIG.APP_INFO.PHYLOGENY_ROOT ?? CONFIG.APP_INFO.PHLOGENY_ROOT
const { DESCRIPTION, FIELD_LABEL } = phylogenyConfig
const { SAVE_CONFIRM } = phylogenyConfig.EDIT

const renderContent = ({ alert = null, selectedPhylogenyRoot = '' } = {}) => {
  const setModalData = vi.fn()

  render(
    <AppModalContext.Provider
      value={{
        modalData: {
          alert,
          confirmCommit: Boolean(alert),
          selectedPhylogenyRoot,
        },
        setModalData,
      }}
    >
      <PhylogenyRootContent conceptNames={['wolf-alias', 'canis lupus']} />
    </AppModalContext.Provider>
  )

  return { setModalData }
}

describe('PhylogenyRootContent', () => {
  it('renders phylogeny description text from app info config', () => {
    renderContent()
    expect(screen.getByText(DESCRIPTION)).toBeInTheDocument()
  })

  it('renders verification alert lines when an alert exists in modal data', () => {
    renderContent({
      alert: {
        lines: SAVE_CONFIRM.LINES,
        severity: SAVE_CONFIRM.SEVERITY,
      },
      selectedPhylogenyRoot: 'wolf-alias',
    })

    SAVE_CONFIRM.LINES.forEach(line => {
      expect(screen.getByText(line)).toBeInTheDocument()
    })
  })

  it('clears verify state and alert when a new root is selected', async () => {
    const user = userEvent.setup()
    const { setModalData } = renderContent({
      alert: {
        lines: SAVE_CONFIRM.LINES,
        severity: SAVE_CONFIRM.SEVERITY,
      },
      selectedPhylogenyRoot: 'wolf-alias',
    })

    const input = screen.getByRole('combobox', { name: FIELD_LABEL })
    await user.click(input)
    await user.clear(input)
    await user.type(input, 'canis lupus')
    await user.click(screen.getByRole('option', { name: 'canis lupus' }))

    expect(setModalData).toHaveBeenCalled()
    const updater = setModalData.mock.calls[setModalData.mock.calls.length - 1][0]
    expect(typeof updater).toBe('function')
    expect(updater({})).toEqual({
      alert: null,
      confirmCommit: false,
      selectedPhylogenyRoot: 'canis lupus',
    })
  })
})
