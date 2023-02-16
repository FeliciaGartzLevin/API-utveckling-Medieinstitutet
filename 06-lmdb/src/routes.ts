import express from "express"
import movierouter from './resources/movie/movie.router'
import directorrouter from './resources/director/director.router'

// instantiate a new router
const router = express.Router()

/**
 * GET /
 */
router.get('/', async (req, res) => {
	res.send({
		message: "I AM MOVIE-DB-API, GIVES POPCORN",
	})
})

/**
 * /movies
 */
router.use('/movies', movierouter)

/**
 *  /directors
 */
router.use('/directors', directorrouter)

export default router
