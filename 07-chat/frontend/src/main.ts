import './assets/scss/style.scss'
import { io, Socket } from 'socket.io-client'
import {
	ChatMessageData,
	ClientToServerEvents,
	ServerToClientEvents
} from '@backend/types/shared/SocketTypes'

const SOCKET_HOST = import.meta.env.VITE_APP_SOCKET_HOST

const messageEl = document.querySelector('#message') as HTMLInputElement
const messageFormEl = document.querySelector('#message-form') as HTMLFormElement
const messagesEl = document.querySelector('#messages') as HTMLDivElement

// Connect to Socket.IO server
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(SOCKET_HOST)

/* Min Lösning
 *
// add a message to the chat
då behlver man inserta message.content
const addMessageToChat = (message: string, ownmessage: boolean) => {

	let own = ''
	if(ownmessage){
		own = 'own-message'
	}
	return messagesEl.innerHTML += `<li class="message ${own}">${message}</li>`

} */

/* Johans lösning
*/
// Add a message to the chat
const addMessageToChat = (message: ChatMessageData, ownMessage = false) => {
	// Create a new LI element
	const messageEl = document.createElement('li')

	// Set class of LI to 'message'
	messageEl.classList.add('message')

	// If the message is from the user, add the class 'own-message'
	if (ownMessage) {
		messageEl.classList.add('own-message')
	}

	// Set the text content of the LI element to the message
	messageEl.textContent = message.content

	// Append the LI element to the messages element
	messagesEl.appendChild(messageEl)

	// Scroll to the bottom of the messages list
	messageEl.scrollIntoView({ behavior: 'smooth' })
}



// Listen for when connection is established
socket.on('connect', () => {
	console.log('💥Connected to the server', socket.id)
})

// Listen for when the server is restarting or stopping
socket.on('disconnect', () => {
	console.log('Disconnected from the server 💀')
})

// Listen for when the server says hello
socket.on('hello', () => {
	console.log('The nice server said hello 👋')
})

// Listen for new chat messages
socket.on('chatMessage', (message) => {
	console.log('📨 YAY SOMEONE WROTE SOMETHING!!!!!!!', message)

	// print message to chat. boolean: is your it own message?
	addMessageToChat(message)
})

// Send a message to the server when form is submitted
messageFormEl.addEventListener('submit', e => {
	e.preventDefault()

	if(!messageEl.value.trim()){
		return
	}

	// Construct message payload
	const message: ChatMessageData = {
		content: messageEl.value,
	}

	// Send (emit) message to the server
	socket.emit('sendChatMessage', message)

	// print message to chat. boolean: is your it own message?
	addMessageToChat(message, true)

	console.log("Emitted 'sendChatMessage' event to server", message)

	// Clear the input field and focus
	messageEl.value = ''
	messageEl.focus()
})
