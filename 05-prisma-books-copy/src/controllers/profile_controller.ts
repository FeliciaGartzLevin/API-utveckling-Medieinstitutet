/**
 * Controller Template
 */
import { Request, Response } from 'express'
import prisma from '../prisma'
import Debug from 'debug'

const debug = Debug("prisma-books:profile_controller")

/**
 * Get all resources
 */
export const getProfile = async (req: Request, res: Response) => {
	// User has authenticated successfully

	// WHO DIS?
	debug("WHO DIS?!: %o", req.token)

	res.send({
		status: "success",
		data: req.token,
	})
}


/**
 * Update the authenticated user's profile
 */
export const updateProfile = async (req: Request, res: Response) => {
}
