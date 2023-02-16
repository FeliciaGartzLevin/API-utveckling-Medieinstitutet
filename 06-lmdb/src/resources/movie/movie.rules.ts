/**
 * Validation Rules for movies
 */
import { body } from 'express-validator'

export const createMovieRules = [
	body('title').exists().withMessage('Title is required').bail().isString().withMessage('Title has to be of type string').bail().isLength({ min: 3}).withMessage('Title must be at least 3 characters long'),
	body('runtime').optional().isInt({min:1}).withMessage('Runtime has to be of type number and at least 1'),
	body('releaseYear').optional().isInt({min:1888, max: Number(new Date().getFullYear()) }).withMessage(`ReleaseYear has to be of type number and between year 1886 and ${Number(new Date().getFullYear())}`),

]
