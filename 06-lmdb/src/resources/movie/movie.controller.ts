import { Request, Response } from "express";
import { matchedData, validationResult } from 'express-validator'
import Debug from 'debug'
import { Movie } from "./movie.model";
import mongoose from "mongoose";


const debug = Debug('lmdb:movie.controller')

/**
 * Get all movies
 */
export const index = async (req: Request, res: Response) => {
	try {
		// Find all movies
		const movies = await Movie.find()
			.sort({ title: 1, releaseYear: 1 })

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
			.populate('director', 'name')
			.populate('actors', 'name')
			.sort('name')


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
		// Create a new movie
		const movie = await new Movie(req.body).save()

			res.send({
				status: "success",
				data: movie,
			})

	} catch (err) {
		debug("Error thrown when creating a movie", err)

		if (err instanceof mongoose.Error.ValidationError) {
			return res.status(400).send({ status: "error", message: err.message })
		}

		res.status(500).send({ status: "error", message: "Error thrown when creating a movie" })
	}
}

/**
 * Update a movie
 *
 * PATCH /movies/:movieId
 */
export const update = async (req: Request, res: Response) => {
	const movieId = req.params.movieId

	try {
		// Update Movie
		const movie = await Movie.findByIdAndUpdate(movieId, req.body)

		// Respond with the newly created Movie
		res.status(200).send({
			status: "success",
			data: null, //eftersom den är långsam på att uppdatera i databasen, så att man inte tror att den inte är ändrad när den faktiskt är det
		})

	} catch (err) {
		debug("Error thrown when updaing movie", err)

		if (err instanceof mongoose.Error.ValidationError) {
			return res.status(400).send({ status: "error", message: err.message })
		}

		res.status(500).send({ status: "error", message: "Error thrown when updating movie" })
	}
}
