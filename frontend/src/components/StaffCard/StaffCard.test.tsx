import { render, screen } from '@testing-library/react'
import { StaffCard } from './StaffCard'
import type { StaffMember } from '../../types'

const baseMember: StaffMember = {
  id: 1,
  name: 'Alice Johnson',
  email: 'alice@stables.com',
  role: 'Trainer',
  joinedAt: '2023-01-15',
  isActive: true,
  eventsCount: 12,
}

describe('StaffCard', () => {
  it('renders the member name and role', () => {
    render(<StaffCard member={baseMember} />)
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
    expect(screen.getByText('Trainer')).toBeInTheDocument()
  })

  it('renders the events count', () => {
    render(<StaffCard member={baseMember} />)
    expect(screen.getByText('12 events')).toBeInTheDocument()
  })

  it('renders zero events count correctly', () => {
    render(<StaffCard member={{ ...baseMember, eventsCount: 0 }} />)
    expect(screen.getByText('0 events')).toBeInTheDocument()
  })
})
