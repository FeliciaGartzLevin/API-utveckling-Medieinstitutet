import express from 'express'
import { register } from '../controllers/register_controller'
import authors from './authors'
import books from './books'
import publishers from './publishers'

const router = express.Router()

/**
 * GET /
 */
router.get('/', (req, res) => {
	res.send({
		message: "I AM API, BEEP BOOP",
	})
})

/**
 *  /authors
 */
router.use('/authors', authors)

/**
 *  /books
 */
router.use('/books', books)

/**
 *  /publishers
 */
router.use('/publishers', publishers)

/**
 * /register
 */
router.post('/register', [
		// place validation rules here
], register)

export default router
