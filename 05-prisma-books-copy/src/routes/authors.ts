/*
* Handle all /author routes
*/
import express from 'express'
import { index, store, addBook } from '../controllers/author_controller'
import prisma from '../prisma'
const router = express.Router()

/**
 * GET /authors
 */

router.get('/', index)
/**
 * POST /authors
 */
router.post('/', store)
/**
 * POST /authors/:authorId/books
 */
router.post('/:authorId/books', addBook)

export default router
