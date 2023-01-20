import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
const main = async () => {
    // Write Prisma Client queries here
    console.log("It works?")

	// Get all users and console.log them
	const users = await prisma.users.findMany() //SELECT * FROM users
	console.log(users)

	// Get all phones and console.log them
	const phones = await prisma.phones.findMany({ //SELECT manufacturer, model FROM phones
		select: {
            manufacturer: true,
            model: true,
            // imei: true,
        },
        where: {
            manufacturer: "Apple",
        },
	})
	console.log(phones)
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
