import express from 'express'
import { index, show, store } /* '* as Moviecontroller' kan istället skrivas */ from './movie.controller'
import { createMovieRules } from './movie.rules'
import * as movieController from './movie.controller'

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

/**
 * PATCH /movies/:movieId
 */
router.patch('/:movieId', movieController.update)

export default router
