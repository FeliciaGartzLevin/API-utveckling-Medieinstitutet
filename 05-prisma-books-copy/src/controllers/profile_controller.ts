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
	res.send({
		status: "success",
		data: null,
	})
}


/**
 * Update a resource
 */
export const updateProfile = async (req: Request, res: Response) => {
}
