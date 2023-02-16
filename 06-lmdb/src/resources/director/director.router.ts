import express from 'express'
import { index, show, store } /* '* as Directorcontroller' kan istället skrivas */ from './director.controller'
const router = express.Router()

/**
 * GET /directors
 */
router.get('/', index)

/**
 * GET /directors/:directorId
 */
router.get('/:directorId', show)

/**
 * POST /directors
 */
router.post('/', store)

export default router
