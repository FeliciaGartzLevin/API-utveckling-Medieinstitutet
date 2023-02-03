/**
 * HTTP Basic Authentication Middleware
 */
import Debug from "debug"
import { NextFunction, Request, Response } from "express"
import bcrypt from 'bcrypt'
import { getUserByEmail } from "../../services/user_services"


const debug = Debug('prisma-books:basic')
export const basic = async (req: Request, res: Response, next: NextFunction) => {
	debug("Hello from auth/basic")

	// Make sure Authorization header exists, otherwise bail🤷‍♀️
	debug(req.headers)
	if(!req.headers.authorization){
		debug("Authorization header missing")

		return res.status(401).send({
			status: "fail",
			data: "Authorization required"
		})
	}

	// Split Authorization header
	debug("Authorization header: %o", req.headers.authorization)
	const [authSchema, base64Payload] = req.headers.authorization!.split(' ')

	// Check that Authorization schema is "Basic", otherwise bail🤷‍♀️
	if(authSchema.toLowerCase() !== "basic"){
		debug("Authorization schema isn't Basic")

		return res.status(401).send({
			status: "fail",
			data: "Authorization required"
		})

	}
	// Decode credentials
	const decodedPayload = Buffer.from(base64Payload, "base64").toString('ascii')
	debug("decodedPayload", decodedPayload)
	// decodedPayload = "jn@thehiveresistance.com:abc123"

	// Split credentials at ":"
	const [email, password] = decodedPayload.split(":")

	// GET user from database, otherwise bail🤷‍♀️
	const user = await getUserByEmail(email)
	if(!user){
		debug("User %s doesn't exist", email)

		return res.status(401).send({
			status: "fail",
			data: "Authorization required"
		})
	}

	// Verify hash against credentials, otherwise bail🤷‍♀️
	debug("incoming email", email)
	debug("incoming password", password)
	debug("user", user)
	const result = await bcrypt.compare(password, user.password)
	debug("result of bcrypt compare: %b", result)

	if (!result) {
		debug("Password for user %s didn't match 😡", email)

		return res.status(401).send({
			status: "fail",
			data: "Authorization required",
		})
	}
	debug("Password for user %s was correct 🥳", email)

	// Attach User to request 🤩
	req.user = user

	// Nothing to see here, move along... ✅
	next()
}

