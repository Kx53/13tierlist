import { Router } from 'express';
import { body, param } from 'express-validator';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import TierList from '../models/TierList.js';
import { handleValidation } from '../middleware/validate.js';
import { createLimiter } from '../middleware/rateLimit.js';

const router = Router();

// Default tiers for new tier lists
const DEFAULT_TIERS = [
  { id: nanoid(8), label: 'S', color: '#FF7F7F', items: [] },
  { id: nanoid(8), label: 'A', color: '#FFBF7F', items: [] },
  { id: nanoid(8), label: 'B', color: '#FFDF7F', items: [] },
  { id: nanoid(8), label: 'C', color: '#FFFF7F', items: [] },
  { id: nanoid(8), label: 'D', color: '#BFFF7F', items: [] },
];

// Helper: verify edit token
const verifyToken = async (req, res, tierList) => {
  const token = req.headers['x-edit-token'];
  if (!token) {
    res.status(401).json({ error: 'Edit token required' });
    return false;
  }
  const valid = await bcrypt.compare(token, tierList.editTokenHash);
  if (!valid) {
    res.status(403).json({ error: 'Invalid edit token' });
    return false;
  }
  return true;
};

// POST /api/tier-lists — Create new tier list
router.post(
  '/',
  createLimiter,
  [
    body('title')
      .trim()
      .notEmpty().withMessage('Title is required')
      .isLength({ max: 200 }).withMessage('Title too long'),
  ],
  handleValidation,
  async (req, res) => {
    try {
      const slug = nanoid(10);
      const editToken = nanoid(32);
      const editTokenHash = await bcrypt.hash(editToken, 10);

      const tierList = await TierList.create({
        slug,
        title: req.body.title,
        editTokenHash,
        tiers: DEFAULT_TIERS.map(t => ({ ...t, id: nanoid(8) })),
      });

      res.status(201).json({
        slug: tierList.slug,
        editToken,
      });
    } catch (error) {
      console.error('Create tier list error:', error);
      res.status(500).json({ error: 'Failed to create tier list' });
    }
  }
);

// GET /api/tier-lists/:slug — Get tier list (public)
router.get(
  '/:slug',
  [param('slug').trim().notEmpty()],
  handleValidation,
  async (req, res) => {
    try {
      const tierList = await TierList.findOne({ slug: req.params.slug })
        .select('-editTokenHash -__v');

      if (!tierList) {
        return res.status(404).json({ error: 'Tier list not found' });
      }

      res.json(tierList);
    } catch (error) {
      console.error('Get tier list error:', error);
      res.status(500).json({ error: 'Failed to get tier list' });
    }
  }
);

// PUT /api/tier-lists/:slug — Update tier list (requires edit token)
router.put(
  '/:slug',
  [
    param('slug').trim().notEmpty(),
    body('title')
      .optional()
      .trim()
      .isLength({ max: 200 }).withMessage('Title too long'),
    body('tiers')
      .optional()
      .isArray().withMessage('Tiers must be an array'),
    body('tiers.*.label')
      .optional()
      .trim()
      .isLength({ max: 20 }).withMessage('Tier label too long'),
    body('tiers.*.color')
      .optional()
      .matches(/^#[0-9a-fA-F]{6}$/).withMessage('Invalid color format'),
    body('tiers.*.items.*.title')
      .optional()
      .trim()
      .isLength({ max: 100 }).withMessage('Item title too long'),
    body('tiers.*.items.*.imageUrl')
      .optional()
      .isURL().withMessage('Invalid image URL')
      .isLength({ max: 2048 }).withMessage('Image URL too long'),
  ],
  handleValidation,
  async (req, res) => {
    try {
      const tierList = await TierList.findOne({ slug: req.params.slug });
      if (!tierList) {
        return res.status(404).json({ error: 'Tier list not found' });
      }

      if (!(await verifyToken(req, res, tierList))) return;

      if (req.body.title !== undefined) tierList.title = req.body.title;
      if (req.body.tiers !== undefined) tierList.tiers = req.body.tiers;

      await tierList.save();

      res.json({
        slug: tierList.slug,
        title: tierList.title,
        tiers: tierList.tiers,
        updatedAt: tierList.updatedAt,
      });
    } catch (error) {
      console.error('Update tier list error:', error);
      res.status(500).json({ error: 'Failed to update tier list' });
    }
  }
);

// POST /api/tier-lists/:slug/items — Add item to a tier
router.post(
  '/:slug/items',
  [
    param('slug').trim().notEmpty(),
    body('tierId').trim().notEmpty().withMessage('Tier ID is required'),
    body('title')
      .trim()
      .notEmpty().withMessage('Item title is required')
      .isLength({ max: 100 }).withMessage('Item title too long'),
    body('imageUrl')
      .trim()
      .notEmpty().withMessage('Image URL is required')
      .isURL().withMessage('Invalid image URL')
      .isLength({ max: 2048 }).withMessage('Image URL too long'),
  ],
  handleValidation,
  async (req, res) => {
    try {
      const tierList = await TierList.findOne({ slug: req.params.slug });
      if (!tierList) {
        return res.status(404).json({ error: 'Tier list not found' });
      }

      if (!(await verifyToken(req, res, tierList))) return;

      const tier = tierList.tiers.find(t => t.id === req.body.tierId);
      if (!tier) {
        return res.status(404).json({ error: 'Tier not found' });
      }

      const newItem = {
        id: nanoid(8),
        title: req.body.title,
        imageUrl: req.body.imageUrl,
      };

      tier.items.push(newItem);
      await tierList.save();

      res.status(201).json(newItem);
    } catch (error) {
      console.error('Add item error:', error);
      res.status(500).json({ error: 'Failed to add item' });
    }
  }
);

// DELETE /api/tier-lists/:slug/items/:itemId — Remove item
router.delete(
  '/:slug/items/:itemId',
  [
    param('slug').trim().notEmpty(),
    param('itemId').trim().notEmpty(),
  ],
  handleValidation,
  async (req, res) => {
    try {
      const tierList = await TierList.findOne({ slug: req.params.slug });
      if (!tierList) {
        return res.status(404).json({ error: 'Tier list not found' });
      }

      if (!(await verifyToken(req, res, tierList))) return;

      let found = false;
      for (const tier of tierList.tiers) {
        const idx = tier.items.findIndex(item => item.id === req.params.itemId);
        if (idx !== -1) {
          tier.items.splice(idx, 1);
          found = true;
          break;
        }
      }

      if (!found) {
        return res.status(404).json({ error: 'Item not found' });
      }

      await tierList.save();
      res.json({ message: 'Item deleted' });
    } catch (error) {
      console.error('Delete item error:', error);
      res.status(500).json({ error: 'Failed to delete item' });
    }
  }
);

export default router;
