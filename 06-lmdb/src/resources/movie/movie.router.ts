import express from 'express'
import { index, show, store } /* '* as Moviecontroller' kan istället skrivas */ from './movie.controller'
import { createMovieRules } from './movie.rules'
const router = express.Router()

/**
 * GET /movies
 */
router.get('/', index)

/**
 * GET /movies/:movieId
 */
router.get('/:movieId', show)

/**
 * POST /movies
 */
router.post('/', /* createMovieRules, */ store)

export default router
