/**
 * Express Server
 */

// Require stuff
require('dotenv').config()
const express = require('express')
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
