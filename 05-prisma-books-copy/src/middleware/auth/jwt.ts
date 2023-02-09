/**
 * JWT Authentication Middleware
 */
import Debug from "debug"
import { NextFunction, Request, Response } from "express"
import jwt from 'jsonwebtoken'
import { JwtPayload } from '../../types'



const debug = Debug('prisma-books:jwt')

/**
 * Validate JWT Access Token
 *
 * Authorization: Bearer <token>
 */
export const validateToken = (req: Request, res: Response, next: NextFunction) => {
	debug('Hello from auth/jwt!')

	// Make sure Authorization header exists, otherwise bail 🛑
	if(!req.headers.authorization){
		debug("Authorization header missing")

		return res.status(401).send({
			status: "fail",
			data: "Authorization required",
		})
	}

	// Split Authorization header on ` `
	// "Bearer <token>"
	const [authSchema, token] = req.headers.authorization.split(' ')

	// Check that Authorization scheme is "Bearer", otherwise bail 🛑
	if(authSchema.toLowerCase() !== 'bearer'){
		debug("Authorization schema isn't Bearer")
		debug("authSchema: ", authSchema)

		return res.status(401).send({
			status: "fail",
			data: "Authorization required",
		})
	}

	// Validate token (and extract payload), otherwise bail 🛑
	try{
		const payload: JwtPayload = ((jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "") as unknown) as JwtPayload) //if null, undefined or falsy blir det en tom sträng. blir den inte tom så är det den till vänster
		debug("Yay got 📦: %o", payload)

		// Attach payload to Request 🤩
		req.token = payload

	}catch (err) {
		debug('Token failed verification', err)

		return res.status(401).send({
			status: "fail",
			data: "Authorization required",
		})
	}

	// pass request along ✅
	next()
}
