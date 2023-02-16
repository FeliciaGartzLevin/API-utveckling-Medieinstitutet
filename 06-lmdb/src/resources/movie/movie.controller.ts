import { Request, Response } from "express";
import { matchedData, validationResult } from 'express-validator'
import Debug from 'debug'
import { Movie } from "./movie.model";


const debug = Debug('lmdb:movie.controller')

/**
 * Get all movies
 */
export const index = async (req: Request, res: Response) => {
	try {
		// Find all movies
		const movies = await Movie.find()

		res.send({
			status: "success",
			data: movies,
		})

	} catch (err) {
		debug("Error thrown when finding movies", err)
		res.status(500).send({ status: "error", message: "Error thrown when finding movies" })
	}
}

/**
 * Get a movie
 *
 * GET /movies/:movieId
 */
export const show = async (req: Request, res: Response) => {
	const movieId = req.params.movieId

	try {
		// Find a single movie
		const movie = await Movie.findById(movieId)

		if(!movie){
			return res.sendStatus(404)
		}
		res.send({
			status: "success",
			data: movie,
		})

	} catch (err) {
		debug("Error thrown when finding movie '%s' : %o", movieId, err)
		res.status(500).send({ status: "error", message: "Error thrown when finding a movie" })
	}
}

/**
 * Create a movie
 */
export const store = async (req: Request, res: Response) => {
	 // Check for validation errors
	const validationErrors = validationResult(req)
	if (!validationErrors.isEmpty()) {
		return res.status(400).send({
			status: "fail",
			data: validationErrors.array(),
		})
	}

	// Get only the validated data from the request
	const validatedData = matchedData(req)

	try {
		// Create a new movie
		const movie = await new Movie(validatedData).save()

			res.send({
				status: "success",
				data: movie,
			})

	} catch (err) {
		debug("Error thrown when creating a movie", err)
		res.status(500).send({ status: "error", message: "Error thrown when creating a movie" })
	}
}
