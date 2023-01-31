/**
 * Validation Rules for User resource
 */
import { body } from 'express-validator'


export const createUserRules = [
	body('name').isString().withMessage('Name has to be of type string').bail().isLength({ min: 3}).withMessage('Name must be at least 3 characters long'),
	body('email').exists().withMessage('Emailadress is required').bail().isEmail().withMessage('Email must be a valid email-adress'),
	body('password').isString().withMessage('Password has to be of type string').bail().isLength({ min: 6}).withMessage('Password must be at least 6 characters long'),
]
// vill man patcha för att t ex ändra lösenord kan andra verifieringsregler användas och importeras till vardera route
export const updateUserRules = [
	body('name').optional().isString().bail().isLength({ min: 3 }),
	body('email').optional().isEmail(),
	body('password').optional().isString().bail().isLength({ min: 6 }),
]
