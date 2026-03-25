import 'dotenv/config'
import { mkdirSync } from 'fs'
import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { staticPlugin } from '@elysiajs/static'
import connectDB from '@/db.js'
import { tierListRoutes } from '@/routes/tierLists'
import { generalLimiter } from '@/middleware/rateLimit'

const PORT = Number(process.env.PORT) || 3001

// Ensure uploads directory exists before static plugin tries to read it
mkdirSync('uploads', { recursive: true })

const app = new Elysia()
  .use(generalLimiter)
  .use(
    cors({
      origin: process.env.CORS_ORIGIN || 'http://localhost:4321',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'x-edit-token'],
    })
  )
  .use(
    await staticPlugin({
      assets: 'uploads',
      prefix: '/uploads',
    })
  )
  .use(tierListRoutes)
  .get('/api/health', () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
  }))

// Connect to DB and start server
await connectDB()

app.listen(PORT, () => {
  console.log(`🦊 Elysia server running on port ${PORT}`)
})

export type App = typeof app
