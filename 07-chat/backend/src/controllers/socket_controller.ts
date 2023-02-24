/**
 * Socket Controller
 */
import Debug from 'debug'
import { Socket } from 'socket.io'
import { ClientToServerEvents, NoticeData, RoomInfoData, ServerToClientEvents, UserJoinResult } from '../types/shared/SocketTypes'
import prisma from '../prisma'

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

		// Let everyone know a new user has joined
		socket.broadcast.to(roomId).emit('userJoined', notice)

		// Let user know they're welcome
		callback({
			success: true,
			data: {
				id: room.id,
				name: room.name,
				users: [],
			},
		}) //false om vi inte vill att de kommer in.

	})

	// Handle user disconnecting
	socket.on('disconnect', () => {
		debug('💀 A user disconnected', socket.id)
	})
}
