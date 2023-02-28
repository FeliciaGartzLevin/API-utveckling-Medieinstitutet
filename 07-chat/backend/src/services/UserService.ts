/**
 * User Service
 */
import prisma from '../prisma'

export const getUsersInRoom = async (roomId: string) => {
	return await prisma.user.findMany({
		where: {
			roomId: roomId,
		}
	})
}

export const deleteAllUsers = async () => {
	return await prisma.user.deleteMany()
}

// export const findRoomOfUser = async (socket.id: string) => {
// 	return await prisma.user.findUnique({
// 		where: {
// 			id: socket.id,
// 		}
// 	})
// }


// export const removeUser = async (socket.id) => {
// 	return await prisma.user.deleteMany({
// 		where: {
// 			id: socket.id,
// 		}
// 	})
// }
