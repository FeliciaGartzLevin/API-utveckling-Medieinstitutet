import { Request, Response } from "express";
import { matchedData, validationResult } from 'express-validator'
import Debug from 'debug'
import { Director } from "./director.model";
import mongoose from "mongoose";


const debug = Debug('lmdb:director.controller')

/**
 * Get all directors
 */
export const index = async (req: Request, res: Response) => {
	try {
		// Find all directors
		const directors = await Director.find()

		res.send({
			status: "success",
			data: directors,
		})

	} catch (err) {
		debug("Error thrown when finding directors", err)
		res.status(500).send({ status: "error", message: "Error thrown when finding directors" })
	}
}

/**
 * Get a director
 *
 * GET /directors/:directorId
 */
export const show = async (req: Request, res: Response) => {
	const directorId = req.params.directorId

	try {
		// Find a single director
		const director = await Director.findById(directorId)

		if(!director){
			return res.sendStatus(404)
		}
		res.send({
			status: "success",
			data: director,
		})

	} catch (err) {
		debug("Error thrown when finding director '%s' : %o", directorId, err)
		res.status(500).send({ status: "error", message: "Error thrown when finding a director" })
	}
}

/**
 * Create a director
 */
export const store = async (req: Request, res: Response) => {
/* 	 // Check for validation errors
	const validationErrors = validationResult(req)
	if (!validationErrors.isEmpty()) {
		return res.status(400).send({
			status: "fail",
			data: validationErrors.array(),
		})
	}

	// Get only the validated data from the request
	const validatedData = matchedData(req)
 */
	try {
		// Create a new director
		const director = await new Director(req.body).save()

			res.send({
				status: "success",
				data: director,
			})

	} catch (err) {
		debug("Error thrown when creating a director", err)

		if (err instanceof mongoose.Error.ValidationError) {
			return res.status(400).send({ status: "error", message: err.message })
		}

		res.status(500).send({ status: "error", message: "Error thrown when creating a director" })
	}
}