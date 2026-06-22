import { useState, useEffect } from 'react'
import { fetchStaff } from '../api/volunteersApi'
import type { StaffMember } from '../types'

export interface UseStaffResult {
  staff: StaffMember[]
  loading: boolean
  error: string | null
}

export function useStaff(): UseStaffResult {
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetchStaff()
      .then((data) => {
        setStaff(data)
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Unknown error')
      })
      .finally(() => setLoading(false))
  }, [])

  return { staff, loading, error }
}
