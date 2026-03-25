import { Elysia, t } from 'elysia'
import bcrypt from 'bcryptjs'
import { nanoid } from 'nanoid'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import TierList from '@/models/TierList.js'

// Default tiers for new tier lists
const createDefaultTiers = () => [
  { id: nanoid(8), label: 'S', color: '#FF7F7F', items: [] },
  { id: nanoid(8), label: 'A', color: '#FFBF7F', items: [] },
  { id: nanoid(8), label: 'B', color: '#FFDF7F', items: [] },
  { id: nanoid(8), label: 'C', color: '#FFFF7F', items: [] },
  { id: nanoid(8), label: 'D', color: '#BFFF7F', items: [] },
]

// Helper: verify edit token
const verifyToken = async (headers: Record<string, string | undefined>, tierList: any) => {
  const token = headers['x-edit-token']
  if (!token) return false
  return bcrypt.compare(token, tierList.editTokenHash)
}

// Validation schemas
const slugParam = t.Object({
  slug: t.String({ minLength: 1 }),
})

const slugItemParams = t.Object({
  slug: t.String({ minLength: 1 }),
  itemId: t.String({ minLength: 1 }),
})

const itemSchema = t.Object({
  id: t.Optional(t.String()),
  title: t.String({ maxLength: 100 }),
  imageUrl: t.Optional(t.String({ maxLength: 2048 })),
})

const tierSchema = t.Object({
  id: t.String(),
  label: t.String({ maxLength: 20 }),
  color: t.String({ pattern: '^#[0-9a-fA-F]{6}$' }),
  items: t.Array(itemSchema),
})

export const tierListRoutes = new Elysia({ prefix: '/api/tier-lists' })

  // POST /api/tier-lists — Create new tier list
  .post(
    '/',
    async ({ body, set }) => {
      try {
        const slug = nanoid(10)
        const editToken = nanoid(32)
        const editTokenHash = await bcrypt.hash(editToken, 10)

        const tierList = await TierList.create({
          slug,
          title: body.title,
          editTokenHash,
          tiers: createDefaultTiers(),
        })

        set.status = 201
        return { slug: tierList.slug, editToken }
      } catch (error) {
        console.error('Create tier list error:', error)
        set.status = 500
        return { error: 'Failed to create tier list' }
      }
    },
    {
      body: t.Object({
        title: t.String({ minLength: 1, maxLength: 200 }),
      }),
    }
  )

  // GET /api/tier-lists/:slug — Get tier list (public)
  .get(
    '/:slug',
    async ({ params, set }) => {
      try {
        const tierList = await TierList.findOne({ slug: params.slug })
          .select('-editTokenHash -__v')

        if (!tierList) {
          set.status = 404
          return { error: 'Tier list not found' }
        }

        return tierList
      } catch (error) {
        console.error('Get tier list error:', error)
        set.status = 500
        return { error: 'Failed to get tier list' }
      }
    },
    { params: slugParam }
  )

  // PUT /api/tier-lists/:slug — Update tier list (requires edit token)
  .put(
    '/:slug',
    async ({ params, body, headers, set }) => {
      try {
        const tierList = await TierList.findOne({ slug: params.slug })
        if (!tierList) {
          set.status = 404
          return { error: 'Tier list not found' }
        }

        if (!(await verifyToken(headers, tierList))) {
          set.status = 403
          return { error: 'Invalid or missing edit token' }
        }

        if (body.title !== undefined) tierList.title = body.title
        if (body.tiers !== undefined) tierList.tiers = body.tiers as any
        if (body.unrankedItems !== undefined) tierList.unrankedItems = body.unrankedItems as any

        await tierList.save()

        return {
          slug: tierList.slug,
          title: tierList.title,
          tiers: tierList.tiers,
          unrankedItems: tierList.unrankedItems,
          updatedAt: tierList.updatedAt,
        }
      } catch (error) {
        console.error('Update tier list error:', error)
        set.status = 500
        return { error: 'Failed to update tier list' }
      }
    },
    {
      params: slugParam,
      body: t.Object({
        title: t.Optional(t.String({ maxLength: 200 })),
        tiers: t.Optional(t.Array(tierSchema)),
        unrankedItems: t.Optional(t.Array(itemSchema)),
      }),
    }
  )

  // POST /api/tier-lists/:slug/items — Add item to a tier
  .post(
    '/:slug/items',
    async ({ params, body, headers, set }) => {
      try {
        const tierList = await TierList.findOne({ slug: params.slug })
        if (!tierList) {
          set.status = 404
          return { error: 'Tier list not found' }
        }

        if (!(await verifyToken(headers, tierList))) {
          set.status = 403
          return { error: 'Invalid or missing edit token' }
        }

        const newItem = {
          id: nanoid(8),
          title: body.title,
          imageUrl: body.imageUrl,
        }

        if (body.tierId === 'unranked') {
          tierList.unrankedItems.push(newItem)
        } else {
          const tier = tierList.tiers.find((t: any) => t.id === body.tierId)
          if (!tier) {
            set.status = 404
            return { error: 'Tier not found' }
          }
          tier.items.push(newItem)
        }

        await tierList.save()

        set.status = 201
        return newItem
      } catch (error) {
        console.error('Add item error:', error)
        set.status = 500
        return { error: 'Failed to add item' }
      }
    },
    {
      params: slugParam,
      body: t.Object({
        tierId: t.String({ minLength: 1 }),
        title: t.String({ minLength: 1, maxLength: 100 }),
        imageUrl: t.Optional(t.String({ maxLength: 2048 })),
      }),
    }
  )

  // DELETE /api/tier-lists/:slug/items/:itemId — Remove item
  .delete(
    '/:slug/items/:itemId',
    async ({ params, headers, set }) => {
      try {
        const tierList = await TierList.findOne({ slug: params.slug })
        if (!tierList) {
          set.status = 404
          return { error: 'Tier list not found' }
        }

        if (!(await verifyToken(headers, tierList))) {
          set.status = 403
          return { error: 'Invalid or missing edit token' }
        }

        let found = false
        const unrankedIdx = tierList.unrankedItems.findIndex(
          (item: any) => item.id === params.itemId
        )
        if (unrankedIdx !== -1) {
          tierList.unrankedItems.splice(unrankedIdx, 1)
          found = true
        } else {
          for (const tier of tierList.tiers) {
            const idx = tier.items.findIndex((item: any) => item.id === params.itemId)
            if (idx !== -1) {
              tier.items.splice(idx, 1)
              found = true
              break
            }
          }
        }

        if (!found) {
          set.status = 404
          return { error: 'Item not found' }
        }

        await tierList.save()
        return { message: 'Item deleted' }
      } catch (error) {
        console.error('Delete item error:', error)
        set.status = 500
        return { error: 'Failed to delete item' }
      }
    },
    { params: slugItemParams }
  )

  // POST /api/tier-lists/upload — Upload image
  .post(
    '/upload',
    async ({ body, set }) => {
      try {
        const file = body.image
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        const ext = file.name ? '.' + file.name.split('.').pop() : '.jpg'
        const filename = 'image-' + uniqueSuffix + ext

        const buffer = await file.arrayBuffer()
        await writeFile(join(process.cwd(), 'uploads', filename), Buffer.from(buffer))

        const imageUrl = `/uploads/${filename}`
        set.status = 201
        return { imageUrl }
      } catch (error) {
        console.error('Upload error:', error)
        set.status = 500
        return { error: 'Failed to upload image' }
      }
    },
    {
      body: t.Object({
        image: t.File({ maxSize: '5m' }),
      }),
    }
  )
