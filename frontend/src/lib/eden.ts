import { treaty } from '@elysiajs/eden'
import type { App } from '../../../backend/src/index'

const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3001'

/**
 * Eden Treaty client for type-safe API calls.
 * Currently kept as reference — api.ts uses fetch directly for stability.
 * Can switch to Eden once monorepo tooling is set up.
 */
export const api = treaty<App>(API_URL)
