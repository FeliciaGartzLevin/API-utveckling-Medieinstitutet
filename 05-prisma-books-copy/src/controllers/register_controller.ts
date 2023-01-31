/**
 * Register Controller
 */

import { debug } from 'console'
import Debug from 'debug'
import { Request, Response } from 'express'
import { matchedData, validationResult } from 'express-validator'
import prisma from '../prisma'

/**
 * Register a new user
 */
export const register = async (req: Request, res: Response) => {
	// Validate incoming data
	const validationErrors = validationResult(req)
	if (!validationErrors.isEmpty()) {
		return res.status(400).send({
			status: "fail",
			data: validationErrors.array(),
		})
	}

	// Get only the validated data from the request
	const validatedData = matchedData(req)

	console.log("req.body:", req.body)
	console.log("validatedData:", validatedData)

	// Calculate a hash + salt for the password

/* 	// Store the user in the database
	try{
		const user = await prisma.user.create({
			name:

		})
		res.send({
			status: "success",
			data: user,
		})



	}catch (err){
		debug("Error thrown when finding products", err)
		res.status(500).send({ status: "error", message: "Something went wrong" })
	}*/

	// Respond with 201 Created + status success
	res.status(201).send({ "status": "success", "data": req.body })

}
