import express from "express"
import prisma from "./prisma" // importing the prisma instance we created
import morgan from "morgan"

const app = express()
app.use(express.json())
app.use(morgan('dev'))


const main = async () => {
	// Write Prisma Client queries here
	console.log("Getting some data")

	/**
	 * GET /
	 */
	app.get('/', (req, res) => {
		res.send({
			message: "I AM API, BEEP BOOP",
		})
	})

	/**
	 * GET /users
	 */
		app.get('/users', async (req, res) => {
			try{
				const users: any = await prisma.users.findMany()
				res.send(users)
			}catch (err) {
					console.error(err)
					res.status(500).send({ message: "Something went wrong querying the database." })
			}
		})

	/**
	 * GET /user/1 + their phones
	 */
		app.get('/users/:userId', async (req, res) => {
			try{
				const userId = Number(req.params.userId)
				const user: any = await prisma.users.findUniqueOrThrow({

					where: {
						id: userId
					},
					include: {
						phones: true,
					}

				})
				res.send(user)
			}catch (err) {
				console.error(err)
				res.status(404).send({
					message: "User not found.",
				})
			}
		})

	/**
	GET /phones
	Get all phones.
	 */
	app.get('/phones', async (req, res) => {
		try{
			const phones = await prisma.phones.findMany()
			res.send(phones)
		}catch (err) {
			console.error(err)
			res.status(500).send({ message: "Something went wrong querying the database." })
		}
	})


	/**
	GET /phones/1
	Get a single phone and their user (if exists).
	 */
	app.get('/phones/:phoneId', async (req, res) => {
		try{
			const {phoneId} = req.params
			const phone = await prisma.phones.findUniqueOrThrow({
				where: {
					id: Number(phoneId),
				},
				include: {
					users: true
				}
			})
			res.send(phone)

		}catch (err) {
			console.error(err)
			res.status(404).send({
				message: "Phone not found.",
			})
		}
	})

	/**
	🌟 POST /users
	Create a new user (using Prisma).
	 */
	app.post('/users', async (req, res) => {
		try{
			const { name } = req.body
			const result = await prisma.users.create({
			  data: { //kunde skrivas data: req.body enbart istället
				name,
			  },
			})
			res.json(result)

		}catch (err) {
			console.error(err)
			res.status(500).send({ message: "Something went wrong creating the record in the database." })
		}
	})

	/**
	🌟 POST /phones
	Create a new phone (using Prisma).
	 */
	app.post('/phones', async (req, res) => {
	/* 	const {
			manufacturer,
			model,
			imei,
			user_id,
			users,
		} = req.body */
		const result = await prisma.phones.create({
			data: req.body /* {
  				manufacturer,
  				model,
  				imei,
  				user_id,
  				users,
			} */
		})
		res.json(result)
	})

}

main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async e => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})

export default app
