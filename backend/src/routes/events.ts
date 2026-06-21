import { Router } from 'express'
import type { Event } from '../data'
import { store } from '../data'

export const eventsRouter = Router()

/**
 * @openapi
 * /api/events:
 *   get:
 *     summary: List all active events
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [show, trail, clinic, grooming]
 *         description: Filter by category
 *     responses:
 *       200:
 *         description: Array of events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 */
eventsRouter.get('/', (req, res) => {
  const { category } = req.query
  const result = category
    ? store.events.filter(e => e.isActive && e.category === category)
    : store.events.filter(e => e.isActive)
  res.json(result)
})

/**
 * @openapi
 * /api/events/{id}:
 *   get:
 *     summary: Get a single event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The event
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Event not found
 */
eventsRouter.get('/:id', (req, res) => {
  const event = store.events.find(e => e.id === Number(req.params['id']))
  if (!event || !event.isActive) return res.status(404).json({ error: 'Event not found' })
  res.json(event)
})

/**
 * @openapi
 * /api/events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EventInput'
 *     responses:
 *       200:
 *         description: Created event
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Missing required fields
 */
eventsRouter.post('/', (req, res) => {
  // ISSUE: unsafe cast — should use Zod to validate the request body
  const { title, date, location, category, description, spotsTotal } = req.body as Partial<Event>
  if (!title || !date || !location || !category || !description || !spotsTotal) {
    return res.status(400).json({ error: 'All fields are required' })
  }
  const newEvent: Event = {
    id: store.nextEventId++,
    title,
    date,
    location,
    category,
    description,
    spotsTotal: Number(spotsTotal),
    spotsRegistered: 0,
    isActive: true,
  }
  store.events.push(newEvent)
  // ISSUE: should return 201 Created, not 200
  res.json(newEvent)
})

/**
 * @openapi
 * /api/events/{id}:
 *   put:
 *     summary: Update an event
 *     tags: [Events]
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
 *             $ref: '#/components/schemas/EventInput'
 *     responses:
 *       200:
 *         description: Updated event
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Event not found
 */
eventsRouter.put('/:id', (req, res) => {
  const idx = store.events.findIndex(e => e.id === Number(req.params['id']))
  if (idx === -1) return res.status(404).json({ error: 'Event not found' })
  // ISSUE: no validation on req.body — any shape is accepted
  store.events[idx] = { ...store.events[idx], ...req.body, id: store.events[idx].id }
  res.json(store.events[idx])
})

/**
 * @openapi
 * /api/events/{id}:
 *   delete:
 *     summary: Soft-delete an event
 *     tags: [Events]
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
 *         description: Event not found
 */
eventsRouter.delete('/:id', (req, res) => {
  const idx = store.events.findIndex(e => e.id === Number(req.params['id']))
  if (idx === -1) return res.status(404).json({ error: 'Event not found' })
  store.events[idx].isActive = false
  res.status(204).send()
})
