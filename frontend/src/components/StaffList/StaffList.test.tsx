import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { StaffList } from './StaffList'
import * as useStaffModule from '../../hooks/useStaff'
import type { StaffMember } from '../../types'

vi.mock('../../hooks/useStaff')

const mockStaff: StaffMember[] = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice@stables.com',
    role: 'Trainer',
    joinedAt: '2023-01-15',
    isActive: true,
    eventsCount: 12,
  },
  {
    id: 2,
    name: 'Bob Martinez',
    email: 'bob@stables.com',
    role: 'Groom',
    joinedAt: '2023-06-01',
    isActive: true,
    eventsCount: 5,
  },
]

describe('StaffList', () => {
  it('shows a loading indicator while fetching', () => {
    vi.spyOn(useStaffModule, 'useStaff').mockReturnValue({
      staff: [],
      loading: true,
      error: null,
    })
    render(<StaffList />)
    expect(screen.getByText('Loading staff...')).toBeInTheDocument()
  })

  it('renders member names when loaded', () => {
    vi.spyOn(useStaffModule, 'useStaff').mockReturnValue({
      staff: mockStaff,
      loading: false,
      error: null,
    })
    render(<StaffList />)
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
    expect(screen.getByText('Bob Martinez')).toBeInTheDocument()
  })

  it('shows an error message on failure', () => {
    vi.spyOn(useStaffModule, 'useStaff').mockReturnValue({
      staff: [],
      loading: false,
      error: 'Network error',
    })
    render(<StaffList />)
    expect(screen.getByText(/Error: Network error/)).toBeInTheDocument()
  })

  it('shows an empty state when there are no staff', () => {
    vi.spyOn(useStaffModule, 'useStaff').mockReturnValue({
      staff: [],
      loading: false,
      error: null,
    })
    render(<StaffList />)
    expect(screen.getByText('No staff members found.')).toBeInTheDocument()
  })

  it('shows the correct staff count in the heading', () => {
    vi.spyOn(useStaffModule, 'useStaff').mockReturnValue({
      staff: mockStaff,
      loading: false,
      error: null,
    })
    render(<StaffList />)
    expect(screen.getByText('Staff (2)')).toBeInTheDocument()
  })
})
