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
			const users: any = await prisma.users.findMany()
			res.send(users)
		})

	/**
	 * GET /user/1 + their phones
	 */
		app.get('/users/:userId', async (req, res) => {
			const userId = Number(req.params.userId)
			const user: any = await prisma.users.findUnique({

				where: {
					id: userId
				},
				include: {
					phones: true,
				}

			})
			res.send(user)
		})

	/**
	GET /phones
	Get all phones.
	 */
	app.get('/phones', async (req, res) => {
		const phones = await prisma.phones.findMany()
		res.send(phones)
	})


	/**
	GET /phones/1
	Get a single phone and their user (if exists).
	 */
	app.get('/phones/:phoneId', async (req, res) => {
		const {phoneId} = req.params
		const phone = await prisma.phones.findUnique({
			where: {
				id: Number(phoneId),
			},
			include: {
				users: true
			}
		})
		res.send(phone)
	})

	/**
	🌟 POST /users
	Create a new user (using Prisma).
	 */
	app.post('/users', async (req, res) => {
		const { name } = req.body
		const result = await prisma.users.create({
		  data: {
			name,
		  },
		})
		res.json(result)
	})

	/**
	🌟 POST /phones
	Create a new phone (using Prisma).
	 */
	app.post('/phones', async (req, res) => {
		const {
			manufacturer,
			model,
			imei,
			user_id,
			users,
		} = req.body
		const result = await prisma.phones.create({
			data: {
  				manufacturer,
  				model,
  				imei,
  				user_id,
  				users,
			}
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
