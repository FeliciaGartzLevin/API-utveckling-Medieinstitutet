/*
* Handle all /book routes
*/
import express from 'express'
import { index, store, show } from '../controllers/book_controller'
import prisma from '../prisma'
const router = express.Router()

/**
 * GET /books
 */
router.get('/', index)

/**
 * GET /books/:bookId
 */
router.get('/:bookId', show)

/**
 * POST /books
 */
router.post('/', store)

export default router
