import { useStaff } from '../../hooks/useStaff'
import { StaffCard } from '../StaffCard/StaffCard'

export function StaffList() {
  const { staff, loading, error } = useStaff()

  if (loading) return <p>Loading staff...</p>
  if (error) return <p className="error-message">Error: {error}</p>
  if (staff.length === 0) return <p>No staff members found.</p>

  return (
    <div>
      <h2 className="section-heading">Staff ({staff.length})</h2>
      <ul className="staff-list">
        {staff.map((member) => (
          <li key={member.id}>
            <StaffCard member={member} />
          </li>
        ))}
      </ul>
    </div>
  )
}
