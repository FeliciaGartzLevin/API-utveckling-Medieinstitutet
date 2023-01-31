/**
 * Register Controller
 */

import { Request, Response } from 'express'
import prisma from '../prisma'

/**
 * Register a new user
 */
export const register = async (req: Request, res: Response) => {
	// Validate incoming data
	// epostadress = epostadress, password.lenght >= 6
	// Calculate a hash + salt for the password

	// Store the user in the database

	// Respond with 201 Created + status success
}
