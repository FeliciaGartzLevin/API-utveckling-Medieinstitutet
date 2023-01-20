/**
 * Express Server
 */

// Require stuff
require('dotenv').config()
const express = require('express')
const { isDate } = require('lodash')
const _ = require('lodash')
const morgan = require('morgan')
const PORT = 3000

// Get the client
const mysql = require('mysql2/promise')

// Create connection to the database
const connection = mysql.createConnection({
	host: process.env.DATABASE_HOST,
	port: process.env.DATABASE_PORT,
	user: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASSWORD,
	database: process.env.DATABASE_NAME,
})

// Create a new Express app
const app = express()

// Parse any incoming JSON
app.use(express.json())

// Log information about all incoming requests using morgan
app.use(morgan('dev'))

// GET /
app.get('/', (req, res) => {
	res.send({
		message: "Oh, hi there ☺️",
	})
})


app.get('/movies', async (req, res) => {
	const db = await connection
	const [rows] = await db.query('SELECT * FROM movies') //destructuring. plockar det som finns på array[0]
	res.send(rows)
})

app.get('/movies/:movieId', async (req, res) => {
	const movieId = Number(req.params.movieId) // kan även skrivas: const { movieId } = req.params  // same as `const movieId = req.params.movieId`

	const db = await connection
	const [movies] = await db.query(`SELECT * FROM movies WHERE id=?`, [movieId]) //frågetecken för att förebygga SQL Injection och t ex DROP (radera) hela databasen

	// [movies] är destructuring. plockar det som finns på array[0]

	// if id don't exist: send error message
	if (!movies.length) {
		res.status(404).send({ message: 'No such record exists.' })
		return
	}

	res.send(movies[0])

})

// /**
//  * @todo 1: Add route and logic for retrieving just one movie (ex: GET /movies/2)
//  *
//  * @todo 2: Handle if no movie with the requested id exists
//  */

/**
 * POST /movies
 *
 * Create a movie
 */
app.post('/movies', async (req, res) => {
	console.log("Incoming!", req.body)
	// const { title, genre, runtime, release_date } = req.body

	// STEP 1: Check that all required data is present, otherwise fail with HTTP 400

	// STEP 2: Check that the incoming data is of the correct data type

	try{
		const db = await connection
		const [result] = await db.query('INSERT INTO movies SET ?', {
			title: req.body.title,
			genre: req.body.genre,
			runtime: req.body.runtime ,
		 	release_date: req.body.release_date,
		})

		// if (!response.ok) {
		// 	throw new Error(`${response.status} ${response.statusText}`);
		// }
		const releaseDate = new Date(req.body.release_date)

		// if(String(req.body.title)/* === isString() */ && String(req.body.genre) /* === isString() */ && Number(req.body.runtime) /* === isNumber() *//*  && Date(req.body.release_date) */ /*  === isDate() */){
		if(typeof(req.body.title) === 'string' && typeof(req.body.genre)  === 'string'  && typeof(req.body.runtime)  === 'number'  && releaseDate instanceof Date ){
			// Send back the received data and append the id of the newly created record
			res.status(201).send({
				...req.body,
				id: result.insertId,
			})
			return
		}else if(!req.body.title || !req.body.genre){
				// Reply with error message
				res.status(400).send({ message: 'Missing data or wrong data types.' })

		}else{
			// Reply with error message
			res.status(400).send({ message: 'Missing data or wrong data types.' })
		}

	} catch (e){

		// Reply with error message
		res.status(400).send({ message: 'Missing data or wrong data types.' })
	}

})

// Catch requests where a route does not exist
app.use((req, res) => {
	res.status(404).send({
		message: `Sorry, no route exists for ${req.method} ${req.path}`,
	})
})

// Start listening for incoming requests on port 3000
app.listen(PORT, () => {
	console.log(`🥳 Yay, server started on localhost:${PORT}`)
})
