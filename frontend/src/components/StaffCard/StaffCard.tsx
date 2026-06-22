import type { StaffMember } from '../../types'

interface StaffCardProps {
  member: StaffMember
}

export function StaffCard({ member }: StaffCardProps) {
  return (
    <div className="staff-card">
      <h3 className="staff-name">{member.name}</h3>
      <p className="staff-role">{member.role}</p>
      <span className="staff-events-count">{member.eventsCount} events</span>
    </div>
  )
}
