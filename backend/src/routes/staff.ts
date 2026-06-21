import { Router } from 'express'
import type { StaffMember } from '../data'
import { store, STAFF_ROLES } from '../data'

export const staffRouter = Router()

/**
 * @openapi
 * /api/staff/roles:
 *   get:
 *     summary: List all valid staff roles
 *     tags: [Staff]
 *     responses:
 *       200:
 *         description: Array of role strings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 */
staffRouter.get('/roles', (_req, res) => {
  res.json(STAFF_ROLES)
})

/**
 * @openapi
 * /api/staff:
 *   get:
 *     summary: List all active staff members
 *     tags: [Staff]
 *     responses:
 *       200:
 *         description: Array of staff members
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StaffMember'
 */
staffRouter.get('/', (_req, res) => {
  res.json(store.staff.filter(s => s.isActive))
})

/**
 * @openapi
 * /api/staff/{id}:
 *   get:
 *     summary: Get a single staff member by ID
 *     tags: [Staff]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The staff member
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StaffMember'
 *       404:
 *         description: Staff member not found
 */
staffRouter.get('/:id', (req, res) => {
  const member = store.staff.find(s => s.id === Number(req.params['id']))
  if (!member || !member.isActive) return res.status(404).json({ error: 'Staff member not found' })
  res.json(member)
})

/**
 * @openapi
 * /api/staff:
 *   post:
 *     summary: Create a new staff member
 *     tags: [Staff]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StaffMemberInput'
 *     responses:
 *       201:
 *         description: Created staff member
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StaffMember'
 *       400:
 *         description: Missing or invalid fields
 */
staffRouter.post('/', (req, res) => {
  const { name, email, role } = req.body as Partial<StaffMember>
  if (!name || !email || !role) {
    return res.status(400).json({ error: 'name, email and role are required' })
  }
  if (!STAFF_ROLES.includes(role)) {
    return res.status(400).json({ error: 'Invalid role' })
  }
  const newMember: StaffMember = {
    id: store.nextStaffId++,
    name,
    email,
    role,
    joinedAt: new Date().toISOString().split('T')[0],
    isActive: true,
    eventsCount: 0,
  }
  store.staff.push(newMember)
  res.status(201).json(newMember)
})

/**
 * @openapi
 * /api/staff/{id}:
 *   put:
 *     summary: Update a staff member
 *     tags: [Staff]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StaffMemberInput'
 *     responses:
 *       200:
 *         description: Updated staff member
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StaffMember'
 *       404:
 *         description: Staff member not found
 */
staffRouter.put('/:id', (req, res) => {
  const idx = store.staff.findIndex(s => s.id === Number(req.params['id']))
  if (idx === -1) return res.status(404).json({ error: 'Staff member not found' })
  store.staff[idx] = { ...store.staff[idx], ...req.body, id: store.staff[idx].id }
  res.json(store.staff[idx])
})

/**
 * @openapi
 * /api/staff/{id}:
 *   delete:
 *     summary: Soft-delete a staff member
 *     tags: [Staff]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Deleted
 *       404:
 *         description: Staff member not found
 */
staffRouter.delete('/:id', (req, res) => {
  const idx = store.staff.findIndex(s => s.id === Number(req.params['id']))
  if (idx === -1) return res.status(404).json({ error: 'Staff member not found' })
  store.staff[idx].isActive = false
  res.status(204).send()
})
