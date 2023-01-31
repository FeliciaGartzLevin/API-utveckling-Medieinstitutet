import express from 'express'
import { body } from 'express-validator'
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
		body('name').isString().withMessage('Name has to be of type string').bail().isLength({ min: 3}).withMessage('Name must be at least 3 characters long'),
		body('email').exists().withMessage('Emailadress is required').bail().isEmail().withMessage('Email must be a valid email-adress'),
		body('password').isString().withMessage('Password has to be of type string').bail().isLength({ min: 6}).withMessage('Password must be at least 6 characters long'),
], register)

export default router
