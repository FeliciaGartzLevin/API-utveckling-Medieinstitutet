/**
 * Register Controller
 */

import { debug } from 'console'
import Debug from 'debug'
import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import { matchedData, validationResult } from 'express-validator'
import { createUser, getUserByEmail } from '../services/user_services'
import jwt from 'jsonwebtoken'


/**
 * Login a user
 */
export const login = async (req: Request, res: Response) => {
	// destructure email and password from request body
	const { email, password } = req.body

	// find user with email, otherwise bail 🛑
	const user = await getUserByEmail(email)
	if (!user) {
		return res.status(401).send({
			status: "fail",
			message: "Authorization required",
		})
	}

	// verify hash against credentials, otherwise bail 🛑
	const result = await bcrypt.compare(password, user.password)
	if (!result) {
		return res.status(401).send({
			status: "fail",
			message: "Authorization required",
		})
	}

	// construct jwt-payload
	const payload = {
		sub: user.id,     // sub = subject the token is issued for
		name: user.name,
	}

	// sign payload with secret and get access token
	if (!process.env.ACCESS_TOKEN_SECRET) {
		return res.status(500).send({
			status: "error",
			message: "No access token secret defined",
		})
	}
	const access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET)

	// respond with access-token
	res.send({
		status: "success",
		data: {
			access_token,  // access_token: access_token
		}
	})
}

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
	// console.log("req.body:", req.body)
	console.log("validatedData:", validatedData)

	// Calculate a hash + salt for the password
	const hashedPassword = await bcrypt.hash(validatedData.password, Number(process.env.SALT_ROUNDS )|| 10)
	console.log("Hashed password:", hashedPassword)

	// Replace password with hashed password
	validatedData.password = hashedPassword

 	// Store the user in the database
	try{
		const user = await createUser({
			name: validatedData.name,
			email: validatedData.email,
			password: validatedData.password
		})

	// Respond with 201 Created + status success
	res.status(201).send({
			status: "success",
			data: req.body
		})


	}catch (err){
		debug("Error thrown at %o when trying to create user", req.body, err)
		return res.status(500).send({ status: "error", message: "Could not create user in database" })
	}

}
