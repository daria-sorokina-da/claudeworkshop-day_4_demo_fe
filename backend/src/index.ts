import express from 'express'
import cors from 'cors'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { eventsRouter } from './routes/events'
import { staffRouter } from './routes/staff'
import { store } from './data'

const app = express()
const PORT = process.env['PORT'] ?? 3001

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'Enchanted Stables API', version: '0.1.0' },
    components: {
      schemas: {
        Event: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            title: { type: 'string' },
            date: { type: 'string', format: 'date' },
            location: { type: 'string' },
            category: { type: 'string', enum: ['show', 'trail', 'clinic', 'grooming'] },
            description: { type: 'string' },
            spotsTotal: { type: 'integer' },
            spotsRegistered: { type: 'integer' },
            isActive: { type: 'boolean' },
          },
        },
        EventInput: {
          type: 'object',
          required: ['title', 'date', 'location', 'category', 'description', 'spotsTotal'],
          properties: {
            title: { type: 'string' },
            date: { type: 'string', format: 'date' },
            location: { type: 'string' },
            category: { type: 'string', enum: ['show', 'trail', 'clinic', 'grooming'] },
            description: { type: 'string' },
            spotsTotal: { type: 'integer' },
          },
        },
        StaffMember: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string' },
            joinedAt: { type: 'string', format: 'date' },
            isActive: { type: 'boolean' },
            eventsCount: { type: 'integer' },
          },
        },
        StaffMemberInput: {
          type: 'object',
          required: ['name', 'email', 'role'],
          properties: {
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
})

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use('/api/events', eventsRouter)
app.use('/api/staff', staffRouter)

app.get('/api/stats', (_req, res) => {
  const activeEvents = store.events.filter(e => e.isActive)
  const activeStaff  = store.staff.filter(s => s.isActive)
  const filledSpots  = activeEvents.reduce((n, e) => n + e.spotsRegistered, 0)
  const totalSpots   = activeEvents.reduce((n, e) => n + e.spotsTotal, 0)
  res.json({
    totalEvents:    activeEvents.length,
    totalStaff:     activeStaff.length,
    openSpots:      totalSpots - filledSpots,
    filledSpots,
  })
})

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

export { app }

if (process.env['NODE_ENV'] !== 'test') {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API running on http://localhost:${PORT}`)
  })
}
