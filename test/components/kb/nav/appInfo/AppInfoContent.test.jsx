import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import AppInfoContent from '@/components/kb/nav/appInfo/AppInfoContent'
import ConfigContext from '@/contexts/config/ConfigContext'
import UserContext from '@/contexts/user/UserContext'

vi.mock('@/version', () => ({
  getVersion: () => '1.2.3-test',
}))

vi.mock('@/components/kb/nav/appInfo/phylogenyRoot/PhylogenyRootDetail', () => ({
  default: () => <div>phylogeny-root-detail</div>,
}))

vi.mock('@/components/kb/nav/appInfo/mediaBaseURL/MediaBaseURLDetail', () => ({
  default: () => <div>media-base-url-detail</div>,
}))

vi.mock('@/components/kb/nav/appInfo/dsgConceptURL/DsgConceptURLDetail', () => ({
  default: () => <div>dsg-concept-url-detail</div>,
}))

const renderWithContexts = () =>
  render(
    <UserContext value={{ user: { name: 'test user', role: 'ADMIN' } }}>
      <ConfigContext value={{ config: { url: 'https://example.test/config' } }}>
        <AppInfoContent />
      </ConfigContext>
    </UserContext>
  )

describe('AppInfoContent', () => {
  it('renders app info details including DSG concept URL detail', () => {
    renderWithContexts()

    expect(screen.getByText('User:')).toBeInTheDocument()
    expect(screen.getByText('Role:')).toBeInTheDocument()
    expect(screen.getByText('Config:')).toBeInTheDocument()
    expect(screen.getByText('test user')).toBeInTheDocument()
    expect(screen.getByText('ADMIN')).toBeInTheDocument()
    expect(screen.getByText('https://example.test/config')).toBeInTheDocument()
    expect(screen.getByText('phylogeny-root-detail')).toBeInTheDocument()
    expect(screen.getByText('media-base-url-detail')).toBeInTheDocument()
    expect(screen.getByText('dsg-concept-url-detail')).toBeInTheDocument()
    expect(screen.getByText('Version:')).toBeInTheDocument()
    expect(screen.getByText('1.2.3-test')).toBeInTheDocument()
  })
})
