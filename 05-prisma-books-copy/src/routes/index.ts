import express from 'express'
import { register } from '../controllers/register_controller'
import authors from './authors'
import books from './books'
import publishers from './publishers'
import { createUserRules  } from '../validations/user_rules'
import profile from './profile'

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
 *  /profile
 */
router.use('/profile', profile)

/**
 *  /publishers
 */
router.use('/publishers', publishers)

/**
 * /register
 */
router.post('/register', createUserRules, register)


export default router
