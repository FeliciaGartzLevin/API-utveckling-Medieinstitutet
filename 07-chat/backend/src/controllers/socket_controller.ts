/**
 * Socket Controller
 */
import Debug from 'debug'
import { Socket } from 'socket.io'
import { ClientToServerEvents, NoticeData, RoomInfoData, ServerToClientEvents, UserJoinResult, usersOnline } from '../types/shared/SocketTypes'
import prisma from '../prisma'
import { User } from '@prisma/client'

// Create a new debug instance
const debug = Debug('chat:socket_controller')

// Handle the user connecting
export const handleConnection = (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
	debug('💥🔌 A user connected', socket.id)

	// Say hello to the user
	debug('Said hello to the user 👋')
	socket.emit('hello')

	// Listen for room list request
	socket.on('getRoomList', async (callback) => {
		// Query database for list of rooms
		const rooms = await prisma.room.findMany()

		debug('🏨 Got request for rooms, sending room list %o', rooms)

		// Send room list
		callback(rooms)
	})

	// Listen for incoming chat messages
	socket.on('sendChatMessage', (message) => {
		debug('📨 New chat message', socket.id, message)
		socket.broadcast.to(message.roomId).emit('chatMessage', message)
	})

	// Listen for a user join request
	socket.on('userJoin', async (username, roomId, callback) => {
		debug('👶🏽 User %s wants to join the room %s', username, roomId)

		// Get room from database
		const room = await prisma.room.findUnique({
			where: {
				id: roomId,
			}
		})

		if (!room) {
			const result: UserJoinResult = {
				success: false,
				data: null,
			}

			return callback(result)
		}

		const notice: NoticeData = {
			timestamp: Date.now(),
			username,
		}

		// Add user to room `roomId
		socket.join(roomId)

		// Create a User in the database if they do not already exist
		// otherwise update the User with the roomId
		const user = await prisma.user.upsert({
			where: {
				id: socket.id,
			},
			create: {
				id: socket.id,
				name: username,
				roomId: roomId,
			},
			update: {
				name: username,
				roomId: roomId,
			},
		})

		// Retrieve a list of Users for the room
		const usersInRoom = await prisma.user.findMany({
			where: {
				roomId: roomId,
			}
		})
		debug("List of users in room %s: %O", roomId, usersInRoom)

		// // Let everyone in the room know who's online
		// socket.broadcast.to(roomId).emit('usersOnline', online)

		// Let everyone know a new user has joined
		socket.broadcast.to(roomId).emit('userJoined', notice)

		// Let user know they're welcome
		callback({
			success: true,
			data: {
				id: room.id,
				name: room.name,
				users: usersInRoom,
			},
		}) //false om vi inte vill att de kommer in.

	})

	// Handle user disconnecting
	socket.on('disconnect', async () => {
		debug('💀 A user disconnected', socket.id)

		// Find room user was in (if any)
		const user = await prisma.user.findUnique({
			where: {
				id: socket.id,
			}
		})

		// If user wasn't in a room, just do nothin
		if(!user) return

		// Remove them from any room they joined
		await prisma.user.deleteMany({
			where: {
				id: socket.id,
			}
		})


	})
}
