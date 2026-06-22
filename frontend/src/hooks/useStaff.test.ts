import { renderHook, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { useStaff } from './useStaff'
import * as volunteersApi from '../api/volunteersApi'
import type { StaffMember } from '../types'

vi.mock('../api/volunteersApi')

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

describe('useStaff', () => {
  it('returns loading true initially then staff data on success', async () => {
    vi.spyOn(volunteersApi, 'fetchStaff').mockResolvedValue(mockStaff)

    const { result } = renderHook(() => useStaff())

    expect(result.current.loading).toBe(true)
    expect(result.current.staff).toEqual([])

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.staff).toEqual(mockStaff)
    expect(result.current.error).toBeNull()
  })

  it('returns an error string when fetch fails', async () => {
    vi.spyOn(volunteersApi, 'fetchStaff').mockRejectedValue(new Error('Server unavailable'))

    const { result } = renderHook(() => useStaff())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.staff).toEqual([])
    expect(result.current.error).toBe('Server unavailable')
  })
})
