/**
 * Profile Router
 */
import express from 'express'
import { getProfile } from '../controllers/profile_controller'
import { basic } from '../middleware/auth/basic'
const router = express.Router()

/**
 * GET /profile
 */
router.get('/', getProfile)

/**
 * PATCH /profile
 */

/**
 * GET /profile/books
 */

/**
 * POST /profile/books
 */

/**
 * DELETE /profile/books
 */

export default router
